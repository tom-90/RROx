import semver from "semver";
import { IPlugin } from "./type";
import { PluginRenderer } from "./renderer";
import { RegistrationStore } from "../registrations";
import { RendererCommunicator, Logger } from "@rrox/api";
import { IPCCommunicator } from "./communicator";
import { PluginsCommunicator } from "../../../shared/communicators/plugins";
import { ElectronLog, LogFunctions } from "electron-log";

export type WebpackRemotePackages = {
    [ module: string ]: {
        get: ( path: string ) => any;
        init: ( shareScope: any ) => any;
    };
} & { load: ( pkgName: string ) => Promise<WebpackRemotePackages[ string ]> };

declare global {
    interface Window {
        __webpack_remotes__: WebpackRemotePackages;
    }
}

declare const log: () => ElectronLog;

export class PluginManager {
    public registrations = new RegistrationStore();
    public communicator: RendererCommunicator = new IPCCommunicator();

    private installed: { [ name: string ]: IPlugin } = {};
    private loaded   : { [ name: string ]: PluginRenderer } = {};
    private loading  : { [ name: string ]: Promise<boolean> | undefined } = {};
    private log: LogFunctions;

    constructor() {
        new Logger( log() );
        this.log = Logger.get( PluginInfo );

        // Overwrite the load method that was previously defined as a no-op in the bootstrap
        window.__webpack_remotes__ = { load: ( pkgName ) => this.webpackRequire( pkgName ) } as WebpackRemotePackages;

        this.communicator.listen( PluginsCommunicator, ( installed, loaded ) => {
            this.processPluginEvent( installed, loaded );
        } );

        this.communicator.rpc( PluginsCommunicator )
            .then( ( [ installed, loaded ]: [ installed: { [ name: string ]: IPlugin }, loaded: string[] ] ) => {
                return this.processPluginEvent( installed, loaded );
            } )
            .catch( ( e ) => {
                this.log.error( 'Error while loading plugins', e );
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
            get : ( ...params: [ path: string ] ) => __webpack_remotes__[ pkgName ].get( ...params ),
            init: ( ...params: [ shareScope: any ] ) => __webpack_remotes__[ pkgName ].init( ...params )
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
                for( let [ dependency, version ] of Object.entries( plugin.dependencies ) )
                    if( !( await this.loadPlugin( dependency, version ) ) )
                        throw `Cannot load "${dependency}@${plugin.dependencies[ dependency ]}". It is not installed.`;
    
                this.loaded[ plugin.name ] = new PluginRenderer( this.registrations, this.communicator, plugin, this.log );
                await this.loaded[ plugin.name ].load();
    
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

}