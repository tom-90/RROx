import path from "path";
import { app } from "electron";
import fs from "fs-extra";
import tar from "tar";
import { IPlugin } from "./type";
import semver from "semver";
import Log from "electron-log";
import fetch from "node-fetch";
import { RROxApp } from "../app";
import { BaseSettings } from "../../shared/settings";

export class PluginInstaller {
    private settings = this.app.settings.init( BaseSettings );

    constructor( private app: RROxApp ) {}

    public getPluginDirectory() {
        return path.resolve( app.getPath( 'userData' ), 'plugins' );
    }

    public getRegistryURL() {
        return 'https://rrox-registry.tom90.nl';
    }

    public async addDevPlugin( pluginDir: string ) {
        const installed = await this.getInstalledPlugins();

        let pkgJson = path.join( pluginDir, 'package.json' );
        
        if( this.settings.get( 'plugins.devFolders' ).includes( path.dirname( pkgJson ) ) )
            return;

        await fs.access( pkgJson, fs.constants.F_OK )
                .then( () => pkgJson )
                .catch( () => {
                    Log.warn( `Failed to load plugin "${path.dirname( pkgJson )}": package.json not found.` );
                    return null;
                } );

        const pkg = __non_webpack_require__( pkgJson );

        this.validatePackageJSON( pkg, installed );

        this.settings.set( 'plugins.devFolders', [ ...this.settings.get( 'plugins.devFolders' ), path.dirname( pkgJson ) ] );
    }

    public async getInstalledPlugins() {
        const rootDir = this.getPluginDirectory();

        await fs.ensureDir( rootDir );

        const dirs = ( await fs.readdir( rootDir, { withFileTypes: true } ) )
            .filter( ( item ) => item.isDirectory() );
            
        let pluginPackages = dirs.filter( ( d ) => !d.name.startsWith( '@' ) )
            .map( ( item ) => path.join( rootDir, item.name, 'package.json' ) );
            
        pluginPackages = pluginPackages.concat(
            ( await Promise.all(
                dirs.filter( ( d ) => d.name.startsWith( '@' ) )
                    .map( ( dir ) => fs.readdir( path.join( rootDir, dir.name ), { withFileTypes: true } )
                        .then( ( entries ) => entries.filter( ( item ) => item.isDirectory() ) 
                            .map( ( item ) => path.join( rootDir, dir.name, item.name, 'package.json' )
                        ) )
            ) ) ).flat()
        );

        const devPackages = this.settings.get( 'plugins.devFolders' ).map( ( dir ) => path.join( dir, 'package.json' ) );
        pluginPackages = pluginPackages.concat( devPackages );

        const validPluginPackages = ( await Promise.all( pluginPackages.map(
            ( p ) => fs.access( p, fs.constants.F_OK )
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
                this.validatePackageJSON( pkg, plugins );

                let author: string | undefined = undefined;
                let description: string | undefined = undefined;

                if( typeof pkg[ 'author' ] === 'string' )
                    author = pkg[ 'author' ];
                else if( pkg[ 'author' ] !== null && typeof pkg[ 'author' ] === 'object' && typeof pkg[ 'author' ][ 'name' ] === 'string' )
                    author = pkg[ 'author' ][ 'name' ];
                if( typeof pkg[ 'description' ] === 'string' )
                    description = pkg[ 'description' ];
                
                plugins[ pkg.name ] = {
                    name           : pkg.name,
                    version        : pkg.version,
                    controllerEntry: pkg.rrox.controller,
                    rendererEntry  : pkg.rrox.renderer,
                    dependencies   : pkg.rrox.pluginDependencies || [],
                    rootDir        : path.dirname( packagePath ),
                    author         : author,
                    description    : description,
                    hasUpdate      : false,
                    dev            : devPackages.includes( packagePath ),
                };
            } catch( e ) {
                Log.warn( `Failed to load plugin "${path.dirname( packagePath )}": ${e}` );
            }
        }

        return plugins;
    }

    public async install( name: string, confirm = false ): Promise<string | void> {
        const installed = await this.getInstalledPlugins();

        if( name in installed )
            return;

        const version = await this.getLatestVersion( name );

        if( version.rrox.pluginDependencies ) {
            if( !confirm ) {
                const toInstall = await this.resolveDependencies( version.rrox.pluginDependencies, installed );

                if( toInstall.length > 0 )
                    return `The following additional plugins will need to be installed:\n` + toInstall.map( ( v ) => ` • (${v.name}) ${v.description}` ).join( '\n' );
            } else {
                for( let dep of version.rrox.pluginDependencies )
                    await this.install( dep, true );
            }
        }

        await this.downloadVersion( version );
    }

    public async uninstall( name: string, confirm = false ): Promise<string | void> {
        const installed = await this.getInstalledPlugins();

        const plugin = installed[ name ];

        if( !plugin )
            return;

        if( plugin.dev ) {
            this.settings.set( 'plugins.devFolders', this.settings.get( 'plugins.devFolders' ).filter( ( dir ) => dir !== plugin.rootDir ) );
            return;
        }

        const toRemove = this.resolveDependents( name, installed );
        if( !confirm && toRemove.length > 0 )
            return `The following plugins will also need to be removed:\n` + toRemove.map( ( v ) => ` • (${v.name}) ${v.description}` ).join( '\n' );
        else if( toRemove.length > 0 )
            for( let remove of toRemove )
                await this.uninstall( remove.name, true );
        
        await fs.remove( plugin.rootDir );
    }

    public async update( name: string, confirm = false ): Promise<string | void> {
        const installed = await this.getInstalledPlugins();

        const plugin = installed[ name ];

        if( !plugin )
            return;

        const version = await this.getLatestVersion( name );

        if( plugin.version === version.version )
            return;

        if( version.rrox.pluginDependencies ) {
            if( !confirm ) {
                const toInstall = await this.resolveDependencies( version.rrox.pluginDependencies, installed );

                if( toInstall.length > 0 )
                    return `The following additional plugins will need to be installed:\n` + toInstall.map( ( v ) => ` • (${v.name}) ${v.description}` ).join( '\n' );
            } else {
                for( let dep of version.rrox.pluginDependencies )
                    await this.install( dep, true );
            }
        }

        await this.downloadVersion( version );
    }

    public async getLatestVersion( name: string ) {
        const data = await this.getRegistryData( name );

        if( !data )
            throw new PluginInstallerError( 'Could not retrieve plugin data from registry.' );

        const latestVersion = data?.[ 'dist-tags']?.[ 'latest' ];

        if( !latestVersion || !data.versions[ latestVersion ] )
            throw new PluginInstallerError( 'Could not find an installable version.' );

        const version = data.versions[ latestVersion ];
        if( !version.rrox )
            throw new PluginInstallerError( 'The plugin cannot be installed due to a configuration error.' );

        return version;
    }

    private async resolveDependencies( dependencies: string[], installed: { [name: string]: IPlugin }, resolved: RegistryVersion[] = [] ): Promise<RegistryVersion[]> {
        for( let dep of dependencies ) {
            if( dep in installed || resolved.some( ( v ) => v.name === dep ) )
                continue;
            
            let version: RegistryVersion;
            try {
                version = await this.getLatestVersion( dep );
            } catch( e ) {
                Log.error( `Could not load information of dependency: '${dep}'.`, e );
                throw new PluginInstallerError( `Could not load information of dependency: '${dep}'.` );
            }
            
            resolved.push( version );

            if( version.rrox.pluginDependencies )
                await this.resolveDependencies( version.rrox.pluginDependencies, installed, resolved );
        }

        return resolved;
    }

    private resolveDependents( name: string, installed: { [ name: string ]: IPlugin }, resolved: IPlugin[] = [] ): IPlugin[] {
        for( let [ plugin, data ] of Object.entries( installed ) ) {
            if( resolved.includes( data ) || !data.dependencies.includes( name ) )
                continue;

            resolved.push( data );
            this.resolveDependents( plugin, installed, resolved );
        }

        return resolved;
    }

	private async getRegistryData( name: string ): Promise<RegistryData | null> {
        const registry = new URL( this.getRegistryURL() );
        registry.pathname = encodeURIComponent( name );

        try {
            const res = await fetch( registry.toString() );
            
            if( !res.ok ) {
                Log.error( 'Failed to retrieve package registry data.', res.status, res.statusText, await res.text() );
                return null;
            }

            const data = ( await res.json() ) as RegistryData;

            if( !data || !data.versions || !data.name ) {
                Log.error( 'Failed to retrieve package registry data. Invalid data object.', data );
                return null;
            }

            return data;
        } catch ( e ) {
            Log.error( 'Failed to retrieve package registry data.', e );
            return null;
        }
	}

    private async downloadVersion( version: RegistryVersion ) {
        if( !version.dist || !version.dist.tarball )
            throw new PluginInstallerError( `Missing package file for '${version.name}'.` );
        
        const tgzFile = path.join( app.getPath( 'temp' ), Date.now().toString() + '.tgz' );

        const res = await fetch( version.dist.tarball );
        const stream = fs.createWriteStream( tgzFile );

        if( !res.ok || !res.body ) {
            Log.error( 'Failed to download package file.', res.status, res.statusText, await res.text() );
            throw new PluginInstallerError( `Failed to download plugin '${version.name}'.` );
        }

        await new Promise( ( resolve, reject ) => {
            res.body!.pipe( stream );
            res.body!.on( "error", reject );
            stream.on( "finish", resolve );
        } );

        const pluginDir = path.join( this.getPluginDirectory(), version.name );

        try {
            await fs.emptyDir( pluginDir );

            await tar.extract( {
                file: tgzFile,
                cwd: pluginDir,
                strip: 1,
            } );
        } catch( e ) {
            Log.error( 'Failed to extract package file.', e );
            throw new PluginInstallerError( `Failed to extract package file for plugin '${version.name}'.` );
        } finally {
            await fs.unlink( tgzFile );
        }
    }

    private validatePackageJSON( pkg: any, plugins: { [ name: string ]: IPlugin } ) {
        if( typeof pkg !== 'object' || pkg == null )
            throw new PluginInstallerError( 'Invalid type' );
        if( typeof pkg.name !== 'string' )
            throw new PluginInstallerError( 'Invalid name' );
        if( plugins[ pkg.name ] != null )
            throw new PluginInstallerError( 'Duplicate name' );
        if( typeof pkg.version !== 'string' || !semver.valid( pkg.version ) )
            throw new PluginInstallerError( 'Invalid version' );
        if( typeof pkg.rrox !== 'object' || pkg.rrox == null )
            throw new PluginInstallerError( 'No RROx configuration' );
        if( typeof pkg.rrox.controller !== 'string' )
            throw new PluginInstallerError( 'No RROx controller entry file' );
        if( pkg.rrox.renderer != null && typeof pkg.rrox.renderer !== 'string' )
            throw new PluginInstallerError( 'No valid RROx renderer entry file' );

        if( pkg.rrox.pluginDependencies != null ) {
            if( !Array.isArray( pkg.rrox.pluginDependencies ) )
                throw 'No valid pluginDependencies array';
            if( !pkg.rrox.pluginDependencies.every( ( item: unknown ) => typeof item === 'string' ) )
                throw 'No valid pluginDependencies array items';
        }
    }
}

export class PluginInstallerError extends Error {
    constructor( message: string ) {
        super( message );

        this.name = 'PluginInstallerError';
    }
}

interface RegistryData {
	name: string;
	"dist-tags"?: {
		[tag: string]: string;
	};
	versions: {
		[version: string]: RegistryVersion
	};
}

interface RegistryVersion {
    dist: {
        tarball: string;
    },
    name: string,
    version: string,
    description: string,
    rrox: {
        pluginDependencies?: string[],
    }
}