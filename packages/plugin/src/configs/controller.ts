import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { RROXPackageJson } from '../types.js';
import webpack from 'webpack';
import { checkEntryPath } from '../utils.js';

export async function getControllerWebpackConfig( pkg: RROXPackageJson ) {
    let entry = pkg.rrox.controllerEntry;

    if( !entry ) // Check dist path with extension replaced with ts
        entry = await checkEntryPath( pkg.rrox.controller, '.ts' );
    if( !entry ) // Check dist path as is
        entry = await checkEntryPath( pkg.rrox.controller );
    if( !entry ) // Check dist path with filename replaced with 'index.ts'
        entry = await checkEntryPath( pkg.rrox.controller, '.ts', 'index.ts' );
    if( !entry ) // Check dist path with filename replaced with 'index.js'
        entry = await checkEntryPath( pkg.rrox.controller, '.js', 'index.js' );

    if( !entry )
        throw new Error( `Could not automatically determine src-path for controller path '${pkg.rrox.controller}'. Please manually specify a controllerEntry path.` );

    const config = {
        target: 'electron-main',
        entry : {},
        output: {
            filename: '[name].js',
            path: path.dirname( path.resolve( process.cwd(), pkg.rrox.controller ) ),
            clean: true,
        },
        plugins: [
            new webpack.container.ModuleFederationPlugin( {
                name   : path.parse( pkg.rrox.controller ).name,
                library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( pkg.name )}]` },
                exposes: {
                    '.': [
                        'webpack/hot/poll?1000',
                        `./${entry.split( path.win32.sep ).join( path.posix.sep )}`
                    ],
                },
                remotes: {
                    '@rrox-plugins/world': '__webpack_remotes__.load("@rrox-plugins/world")'
                },
            } ),
        ]
    };

    if( entry.endsWith( '.ts' ) || entry.endsWith( '.tsx' ) )
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin( {
                async: true,
                typescript: {
                    configOverwrite: {
                        include: [
                            `${path.dirname( entry ).split( path.win32.sep ).join( path.posix.sep )}/**/*`
                        ]
                    }
                }
            } )
        );

    return config;
}