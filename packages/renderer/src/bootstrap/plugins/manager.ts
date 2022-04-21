import semver from "semver";
import { IPlugin } from "./type";
import { PluginRenderer } from "./renderer";
import { RegistrationStore } from "../registrations";
import { RendererCommunicator, Logger, ValueConsumer } from "@rrox/api";
import { ElectronLog, LogFunctions } from "electron-log";
import { SettingsManager } from "./settings";
import { PluginsCommunicator } from "../../communicators";

export type WebpackRemotePackages = {
    [ module: string ]: {
        get: ( path: string ) => any;
        init: ( shareScope: any ) => any;
    };
} & { load: ( pkgName: string ) => Promise<WebpackRemotePackages[ string ]> };

declare global {
    interface Window {
        __webpack_remotes__: WebpackRemotePackages;
        __webpack_share_scopes__: any;
    }
}

export enum PluginManagerMode {
    Local,
    Remote,
}

export class PluginManager {
    public registrations = new RegistrationStore();
    public settings: SettingsManager;

    private installed: { [ name: string ]: IPlugin } = {};
    private loaded   : { [ name: string ]: PluginRenderer } = {};
    private loading  : { [ name: string ]: Promise<boolean> | undefined } = {};
    private log: LogFunctions;
    private enabled = false;
    private mode: PluginManagerMode = PluginManagerMode.Local;

    constructor( public communicator: RendererCommunicator ) {
        this.log = Logger.get( PluginInfo );
        this.settings = new SettingsManager( this.communicator, this.log );

        // Overwrite the load method that was previously defined as a no-op in the bootstrap
        window.__webpack_remotes__ = { load: ( pkgName ) => this.webpackRequire( pkgName ) } as WebpackRemotePackages;
    }

    public enable() {
        if( this.enabled )
            return;
        this.enabled = true;
        
        new ValueConsumer( this.communicator, PluginsCommunicator ).on( 'update', ( [ installed, loaded ] ) => {
            this.processPluginEvent( installed, loaded );
        } );
    }

    private async processPluginEvent( installed: { [ name: string ]: IPlugin }, loaded: string[] ) {
        this.installed = installed;
        for( let plugin of loaded )
            await this.loadPlugin( plugin );
    }

    public getLoadedPlugins() {
        return this.loaded;
    }

    public async webpackRequire( pkgName: string ) {
        if( !( await this.loadPlugin( pkgName ) ) )
            throw new Error( 'Unable to load plugin.' );

        return {
            get : ( ...params: [ path: string ] ) => window.__webpack_remotes__[ pkgName ].get( ...params ),
            init: ( ...params: [ shareScope: any ] ) => window.__webpack_remotes__[ pkgName ].init( ...params )
        }
    }

    public async loadPlugin( pluginOrName: IPlugin | string, version?: string ): Promise<boolean> {
        let plugin: IPlugin;

        if( typeof pluginOrName === 'string' ) {
            plugin = this.installed[ pluginOrName ];
            if( !plugin )
                return false;
            if( version && !semver.satisfies( plugin.version, version ) )
                return false;
        } else
            plugin = pluginOrName;

        if( this.loading[ plugin.name ] )
            return await this.loading[ plugin.name ]!;

        if( this.loaded[ plugin.name ] )
            return true;

        if( !plugin.rendererEntry )
            return false;

        this.loading[ plugin.name ] = ( async () => {
            try {
                for( let dependency of plugin.dependencies )
                    if( !( await this.loadPlugin( dependency ) ) )
                        throw `Cannot load "${dependency}". It is not installed.`;
    
                this.loaded[ plugin.name ] = new PluginRenderer( this.registrations, this.communicator, plugin, this.log );
                await this.loaded[ plugin.name ].load( this.mode );
    
                return true;
            } catch( e ) {
                delete this.loaded[ plugin.name ];
                this.log.error( `Failed to load plugin "${plugin.name}":`, e );
    
                return false;
            }
        } )();

        const result = await this.loading[ plugin.name ]!;
        delete this.loading[ plugin.name ];

        return result;
    }

    public async unloadPlugins() {
        for( let name in this.loaded ) {
            const plugin = this.loaded[ name ];

            await plugin.unload();

            delete this.loaded[ name ];
        }
    }

    public async setMode( mode: PluginManagerMode ) {
        if( this.mode === mode )
            return;

        await this.unloadPlugins();

        this.mode = mode;
    }
}