import path from "path";
import fs from "fs";
import Log from "electron-log";
import semver from "semver";
import { IPlugin } from "./type";
import { PluginController } from "./controller";
import { RROxApp } from "../app";
import { PluginsCommunicator } from "../../shared/communicators";

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

    private app: RROxApp;

    constructor( app: RROxApp ) {
        this.app = app;

        global.__webpack_remotes__ = {
            load: ( async ( pkgName: string ) => {
                if( !( await this.loadPlugin( pkgName ) ) )
                    throw new Error( 'Unable to load plugin.' );

                return {
                    get : ( ...params: [ path: string ] ) => __webpack_remotes__[ pkgName ].get( ...params ),
                    init: ( ...params: [ shareScope: any ] ) => __webpack_remotes__[ pkgName ].init( ...params )
                }
            } ) as any
        }

        app.communicator.handle( PluginsCommunicator, (): [ { [ name: string ]: IPlugin }, string[] ]  => {
            return [ this.installed, Object.keys( this.loaded ) ];
        } );
    }

    private emitUpdate() {
        this.app.communicator.emit( PluginsCommunicator, this.installed, Object.keys( this.loaded ) );
    }

    public getPluginDirectory() {
        // TODO: Change to appdata dir
        return path.resolve( __dirname, '../../../../plugins' );
    }

    public async getInstalledPlugins() {
        const rootDir = this.getPluginDirectory();

        const pluginPackages = ( await fs.promises.readdir( rootDir, { withFileTypes: true } ) )
            .filter( ( item ) => item.isDirectory() )
            .map( ( item ) => path.join( rootDir, item.name, 'package.json' ) );

        const validPluginPackages = ( await Promise.all( pluginPackages.map(
            ( p ) => fs.promises.access( p, fs.constants.F_OK )
                .then( () => p )
                .catch( () => {
                    Log.warn( `Failed to load plugin "${path.dirname( p )}": package.json not found.` );
                    return null;
                } )
        ) ) ).filter( ( p ) => p != null ) as string[];

        const plugins: { [ name: string ]: IPlugin } = {};

        for( const packagePath of validPluginPackages ) {
            try {
                const pkg = __non_webpack_require__( packagePath );

                // Check for valid configuration
                if( typeof pkg !== 'object' || pkg == null )
                    throw 'Invalid type';
                if( typeof pkg.name !== 'string' )
                    throw 'Invalid name';
                if( plugins[ pkg.name ] != null )
                    throw 'Duplicate name';
                if( typeof pkg.version !== 'string' || !semver.valid( pkg.version ) )
                    throw 'Invalid version';
                if( typeof pkg.rrox !== 'object' || pkg.rrox == null )
                    throw 'No RROx configuration';
                if( typeof pkg.rrox.controller !== 'string' )
                    throw 'No RROx controller entry file';
                if( pkg.rrox.renderer != null && typeof pkg.rrox.renderer !== 'string' )
                    throw 'No valid RROx renderer entry file';

                if( pkg.dependencies != null ) {
                    if( typeof pkg.dependencies !== 'object' )
                        throw 'No valid dependencies object';
                    if( !Object.entries( pkg.dependencies ).every(
                        ( [ key, version ] ) => typeof key === 'string' &&  typeof version === 'string' && semver.validRange( version ) != null ) )
                        throw 'No valid dependencies object';
                }
                
                plugins[ pkg.name ] = {
                    name           : pkg.name,
                    version        : pkg.version,
                    controllerEntry: pkg.rrox.controller,
                    rendererEntry  : pkg.rrox.renderer,
                    dependencies   : pkg.dependencies ?? {},
                    rootDir        : path.dirname( packagePath ), 
                };
            } catch( e ) {
                Log.warn( `Failed to load plugin "${path.dirname( packagePath )}": ${e}` );
            }
        }

        this.installed = plugins;
        this.emitUpdate();

        return plugins;
    }

    public getLoadedPlugins() {
        return this.loaded;
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

        try {
            // Make sure we cannot load the same plugin twice
            this.loaded[ plugin.name ] = new PluginController( this.app, plugin );
            this.emitUpdate();

            for( let [ dependency, version ] of Object.entries( plugin.dependencies ) )
                if( !( await this.loadPlugin( dependency, version ) ) )
                    throw `Cannot load "${dependency}@${plugin.dependencies[ dependency ]}". It is not installed.`;

            await this.loaded[ plugin.name ].load();

            return true;
        } catch( e ) {
            delete this.loaded[ plugin.name ];
            this.emitUpdate();

            Log.error( `Failed to load plugin "${plugin.name}":`, e );

            return false;
        }
    }

}