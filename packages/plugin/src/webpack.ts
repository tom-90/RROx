import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { getControllerWebpackConfig, getRendererWebpackConfig, getBaseWebpackConfig } from './configs/index.js';
import { createSpinner } from './spinner.js';
import { RROXPackageJson } from './types.js';

export async function startWebpack( pkg: RROXPackageJson, watch: boolean ) {
    const spinner = await createSpinner( 'Building plugin...' );

    spinner.start();

    if( watch && !process.env.NODE_ENV )
        process.env.NODE_ENV = 'development';
    else if( !process.env.NODE_ENV )
        process.env.NODE_ENV = 'production';

    const base = getBaseWebpackConfig( pkg );
    const controller = merge<any>( base, await getControllerWebpackConfig( pkg ) );
    const renderer = merge<any>( base, await getRendererWebpackConfig( pkg ) );

    try {
        if( !watch ) {
            webpack( [ controller, renderer ], ( err, stats ) => {
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

            const compiler = webpack( [ controller, renderer ] );

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