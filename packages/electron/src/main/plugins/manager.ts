import Log from "electron-log";
import { app as electronApp, dialog } from "electron";
import semver from "semver";
import { IPlugin } from "./type";
import { PluginController } from "./controller";
import { RROxApp } from "../app";
import { PluginsCommunicator, InstallPluginCommunicator, UninstallPluginCommunicator, RestartCommunicator, UpdatePluginCommunicator, DevPluginCommunicator } from "../../shared/communicators";
import { PluginInstaller } from "./installer";
import { ValueProvider } from "@rrox/api";

type WebpackRemotePackages = {
    [ module: string ]: {
        get: ( path: string ) => any;
        init: ( shareScope: any ) => any;
    };
} & { load: ( pkgName: string ) => Promise<WebpackRemotePackages[ string ]> };

declare global {
    var __webpack_remotes__: WebpackRemotePackages;
    var __non_webpack_require__: ( package: string ) => any;
}

export class PluginManager {
    private installed: { [ name: string ]: IPlugin } = {};
    private loaded   : { [ name: string ]: PluginController } = {};

    private valueProvider: ValueProvider<[ installed: { [ name: string ]: IPlugin }, loaded: string[], loading: boolean ]>;
    private installer = new PluginInstaller( this.app );

    constructor( private app: RROxApp ) {

        global.__webpack_remotes__ = {
            load: ( async ( pkgName: string ) => {
                if( !( await this.loadPlugin( pkgName ) ) )
                    throw new Error( 'Unable to load plugin.' );

                return {
                    get : ( ...params: [ path: string ] ) => __webpack_remotes__[ pkgName ].get( ...params ),
                    init: ( ...params: [ shareScope: any ] ) => __webpack_remotes__[ pkgName ].init( ...params )
                }
            } ) as any
        };

        this.valueProvider = app.communicator.provideValue( PluginsCommunicator, [ this.installed, Object.keys( this.loaded ), false ] );

        app.communicator.handle(   InstallPluginCommunicator, ( name: string, confirm = false ) => this.  installPlugin( name, confirm ) );
        app.communicator.handle( UninstallPluginCommunicator, ( name: string, confirm = false ) => this.uninstallPlugin( name, confirm ) );
        app.communicator.handle(    UpdatePluginCommunicator, ( name: string, confirm = false ) => this.   updatePlugin( name, confirm ) );

        app.communicator.handle( DevPluginCommunicator, () => this.addDevPlugin() );

        app.communicator.handle( RestartCommunicator, () => {
            electronApp.relaunch();
            electronApp.exit();
        } );
    }

    private emitUpdate( loading: boolean = false ) {
        this.valueProvider.provide( [ this.installed, Object.keys( this.loaded ), loading ] );
    }

    public async getInstalledPlugins() {
        this.installed = await this.installer.getInstalledPlugins();
        this.emitUpdate();

        await this.fetchUpdates();

        return this.installed;
    }

    public getLoadedPlugins() {
        return this.loaded;
    }

    public async loadInstalledPlugins() {
        await this.getInstalledPlugins();

        for( let installed in this.installed )
            await this.loadPlugin( installed );
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

        if( this.loaded[ plugin.name ] )
            return true;

        this.emitUpdate( true );

        try {
            // Make sure we cannot load the same plugin twice
            this.loaded[ plugin.name ] = new PluginController( this.app, plugin );

            for( let dependency of plugin.dependencies )
                if( !( await this.loadPlugin( dependency ) ) )
                    throw `Cannot load "${dependency}". It is not installed.`;

            await this.loaded[ plugin.name ].load();

            this.emitUpdate( false );

            return true;
        } catch( e ) {
            delete this.loaded[ plugin.name ];
            this.emitUpdate( false );

            Log.error( `Failed to load plugin "${plugin.name}":`, e );

            return false;
        }
    }

    private async fetchUpdates() {
        for( let pkg of Object.values( this.installed ) ) {
            if( pkg.dev )
                continue;

            try {
                const info = await this.installer.getLatestVersion( pkg.name );

                pkg.hasUpdate = semver.gt( info.version, pkg.version );
            } catch( e ) {
                Log.warn( `Failed to fetch '${pkg.name}' plugin from registry.`, e );
            }
        }

        this.emitUpdate();
    }

    private async installPlugin( name: string, confirm: boolean ) {
        const res = await this.installer.install( name, confirm );

        if( res )
            return res;

        await this.getInstalledPlugins();
        await this.loadInstalledPlugins();
    }

    private async uninstallPlugin( name: string, confirm: boolean ) {
        const res = await this.installer.uninstall( name, confirm );

        if( res )
            return res;

        await this.getInstalledPlugins();
    }

    private async updatePlugin( name: string, confirm: boolean ) {
        const res = await this.installer.update( name, confirm );

        if( res )
            return res;

        await this.getInstalledPlugins();
    }

    public async installDefaultPlugins() {
        const defaultPlugins = [
            '@rrox-plugins/map'
        ];

        for( let plugin of defaultPlugins ) {
            try {
                this.emitUpdate( true );
                await this.installPlugin( plugin, true );
            } catch( e ) {
                Log.warn( 'Failed to load default plugin. Skipping...', plugin, e );
            }
        }

        this.emitUpdate( false );
    }

    private async addDevPlugin() {
        const returnValue = await dialog.showOpenDialog( this.app.windows[ 0 ], {
            properties: [ 'openDirectory' ]
        } );

        if( returnValue.canceled || returnValue.filePaths.length !== 1 )
            return;

        const pluginPath = returnValue.filePaths[ 0 ];

        await this.installer.addDevPlugin( pluginPath );
        await this.getInstalledPlugins();
        await this.loadInstalledPlugins();
    }
}