import { Actions, ActionType, Controller, ControllerCommunicator, IPluginController, SettingsManager, SetupFunction } from "@rrox/api";
import { QueryAction, GetStructAction } from "../actions";
import { RROxApp } from "../app";
import { EventEmitter } from "events";
import { IPlugin } from "./type";
import path from "path";
import Log from "electron-log";
import { ISetupFunction } from ".";
import { Mutex } from 'async-mutex';
import { PluginCommunicator } from "./communicator";
import { PluginSettingsManager } from "./settings";

export class PluginController extends EventEmitter implements IPluginController {

    public communicator: PluginCommunicator;
    public instance?: Controller;
    public settings: SettingsManager;

    private setupLock = new Mutex();
    private setups: ISetupFunction[] = [];
    private log: Log.LogFunctions;
    private initialized = false;

    constructor( private app: RROxApp, public plugin: IPlugin ) {
        super();

        this.log = Log.scope( plugin.name );

        this.communicator = new PluginCommunicator( this.app.communicator, plugin );
        this.settings = new PluginSettingsManager( this.app.settings, plugin );

        this.app.on( 'ready', () => {
            this.emit( 'connect' );
            this.executeSetups();
        } );
        this.app.on( 'disconnect', () => {
            this.emit( 'disconnect' );
            this.cleanupSetups();
        } );
    }

    async load(): Promise<boolean> {
        try {
            __non_webpack_require__( path.join( this.plugin.rootDir, this.plugin.controllerEntry ) );
    
            if( !__webpack_remotes__[ this.plugin.name ] )
                throw new Error( 'The plugin failed to initialize.' );

            const pkg = __webpack_remotes__[ this.plugin.name ];

            await pkg.init( __webpack_share_scopes__.default );

            const pluginClass = ( await pkg.get( '.' ) )().default;
    
            if( typeof pluginClass !== 'function'
                || !pluginClass.prototype
                || typeof pluginClass.prototype.load !== 'function'
                || typeof pluginClass.prototype.unload !== 'function' )
                throw new Error( 'Default export of index file is not a valid plugin.' );
    
            const controller = new pluginClass() as Controller;
    
            await controller.load( this );

            this.instance = controller;

            return true;
        } catch( e ) {
            this.log.error( 'Failed to load ', e );
            return false;
        }
    }

    async unload(): Promise<boolean> {
        if( !this.instance )
            return true;

        try {
            await this.cleanupSetups();
            await this.communicator.unload();

            await this.instance.unload( this );

            this.instance = undefined;

            this.removeAllListeners();

            return true;
        } catch( e ) {
            this.log.error( 'Failed to unload', e );
            return false;
        }
    }

    async reload() {
        try {
            if( !( await this.unload() ) )
                throw new Error( 'Failed unloading' );

            if( !( await this.load() ) )
                throw new Error( 'Failed loading' );
        } catch( e ) {
            this.log.error( 'Failed to reload', this.plugin.name, e );
        }
    }

    getAction<A extends Actions>( action: A ): ActionType<A> {
        switch( action ) {
            case Actions.QUERY:
                return this.app.getAction( QueryAction ) as ActionType<A>;
            case Actions.GET_STRUCT:
                return this.app.getAction( GetStructAction ) as ActionType<A>;
        }

        throw new Error( 'Unknown action' );
    }

    isConnected() {
        return this.app.isConnected();
    }

    isLoaded() {
        return this.instance != null;
    }

    isInitialized() {
        return this.initialized;
    }

    private async executeSetups() {
        let release = await this.setupLock.acquire();

        if( !this.isConnected() )
            return release();
    
        try {
            for( let setup of this.setups ) {
                if( setup.executed )
                    continue;

                const cleanup = await setup.function();
                if( cleanup )
                    setup.cleanup = cleanup;

                setup.executed = true;
            }

            this.initialized = true;
            this.emit( 'initialized', this.initialized );

            release();
        } catch( e ) {
            this.log.error( 'Failed to execute setup functions', e );
            this.log.error( 'Unloading...' );

            this.initialized = false;
            this.emit( 'initialized', this.initialized );

            release();

            await this.unload();
        }
    }

    private async cleanupSetups() {
        let release = await this.setupLock.acquire();

        this.initialized = false;
        this.emit( 'initialized', this.initialized );

        try {
            for( let setup of this.setups.reverse() ) {
                if( !setup.executed )
                    continue;

                setup.executed = false;

                if( setup.cleanup )
                    await setup.cleanup();
                setup.cleanup = undefined;
            }

            release();
        } catch( e ) {
            this.log.error( 'Failed to cleanup setup functions', e );

            release();
        }
    }

    async addSetup( callback: SetupFunction ): Promise<void> {
        // If function was already added, ignore.
        if( this.setups.some( ( s ) => s.function === callback ) )
            return;

        this.setups.push( {
            function: callback,
            executed: false,
        } );

        await this.executeSetups();
    }

    async removeSetup( callback: SetupFunction, cleanup: boolean = true ): Promise<void> {
        let release = await this.setupLock.acquire();

        const setupIndex = this.setups.findIndex( ( s ) => s.function === callback );

        // Ignore if setup function does not exist
        if( setupIndex < 0 )
            return release();

        const [ setup ] = this.setups.splice( setupIndex, 1 );

        if( !setup.executed || !setup.cleanup || !cleanup )
            return release();

        try {
            await setup.cleanup();
        } catch( e ) {
            this.log.warn( 'Failed to cleanup setup function while removing it.', e );
        }

        release();
    }
}