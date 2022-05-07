import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { getControllerWebpackConfig, getRendererWebpackConfig, getBaseWebpackConfig } from './configs/index.js';
import { createSpinner } from './spinner.js';
import { Config, ConfigAPI, ExposesConfig, RROXPackageJson, SharedConfig } from './types.js';
import path from 'path';
import fs from 'fs-extra';
import url from 'url';

const RROX_CONFIG_FILE = 'configs/rrox.config.js';

export async function startWebpack( pkg: RROXPackageJson, watch: boolean ) {
    const spinner = await createSpinner( 'Building plugin...' );

    spinner.start();

    if( watch && !process.env.NODE_ENV )
        process.env.NODE_ENV = 'development';
    else if( !process.env.NODE_ENV )
        process.env.NODE_ENV = 'production';

    const api: ConfigAPI = {
        package: pkg,
        renderer: createConfig(),
        controller: createConfig(),
        development: process.env.NODE_ENV === 'development',
    };

    await getBaseWebpackConfig( api );
    await getControllerWebpackConfig( api );
    await getRendererWebpackConfig( api );

    const configPath = path.join( process.cwd(), RROX_CONFIG_FILE );

    if( await fs.pathExists( configPath ) ) {
        const configFn = await import( url.pathToFileURL( configPath ).toString() );

        if( typeof configFn === 'function' )
            await configFn( api );
        else if( typeof configFn === 'object' && configFn !== null && typeof configFn[ 'default' ] === 'function' )
            await configFn.default( api );
        else
            console.warn( `The config file located at '${RROX_CONFIG_FILE}' is invalid.` );
    }

    const config = [ api.controller.get(), api.renderer.get() ];

    try {
        if( !watch ) {
            webpack( config, ( err, stats ) => {
                if ( err ) {
                    spinner.fail( err.message );
                    return;
                }
        
                spinner.succeed( 'Plugin built.' );
        
                console.log( stats?.toString( {
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                } ) );
            } );
        } else {
            spinner.succeed( 'Started dev server.' );

            const compiler = webpack( config );

            const server = new WebpackDevServer( {   
                host: 'localhost',      
                hot: true,
                devMiddleware: {
                    writeToDisk: true,
                },
                static: false,
            }, compiler as any );

            server.logger = compiler.getInfrastructureLogger( 'RROx' );

            await server.start();
        }
    } catch( e ) {
        spinner.fail( String( e ) );
    }
}

function createConfig(): Config {
    let config = {};
    let sharing: {
        exposed: { [ key: string ]: string | string[] | ExposesConfig },
        shared: { [ module: string ]: string | SharedConfig },
    } = {
        exposed: {},
        shared: {},
    };

    return {
        get: () => config,
        set: ( newConfig ) => {
            config = newConfig;
            return config;
        },
        merge: ( newConfig ) => {
            config = merge( config, newConfig );
            return config;
        },

        sharing: {
            expose   : ( key, module ) => sharing.exposed[ key ] = module,
            share    : ( module, config = {} ) => sharing.shared[ module ] = config,
            getConfig: () => sharing,
        }
    }
}