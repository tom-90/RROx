import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';
import { RROXPackageJson } from '../types.js';
import { checkEntryPath } from '../utils.js';
import { SHARED_MODULES } from '../definitions/shared.js';

export async function getRendererWebpackConfig( pkg: RROXPackageJson ) {
    let entry = pkg.rrox.rendererEntry;

    if( !entry ) // Check dist path with extension replaced with ts
        entry = await checkEntryPath( pkg.rrox.renderer, '.ts' );
    if( !entry ) // Check dist path with extension replaced with tsx
        entry = await checkEntryPath( pkg.rrox.renderer, '.tsx' );
    if( !entry ) // Check dist path as is
        entry = await checkEntryPath( pkg.rrox.renderer );
    if( !entry ) // Check dist path with extension replaced with jsx
        entry = await checkEntryPath( pkg.rrox.renderer, '.jsx' );
    if( !entry ) // Check dist path with filename replaced with 'index.ts'
        entry = await checkEntryPath( pkg.rrox.renderer, '.ts', 'index.ts' );
    if( !entry ) // Check dist path with filename replaced with 'index.tsx'
        entry = await checkEntryPath( pkg.rrox.renderer, '.tsx', 'index.tsx' );
    if( !entry ) // Check dist path with filename replaced with 'index.js'
        entry = await checkEntryPath( pkg.rrox.renderer, '.js', 'index.js' );
    if( !entry ) // Check dist path with filename replaced with 'index.jsx'
        entry = await checkEntryPath( pkg.rrox.renderer, '.jsx', 'index.jsx' );

    if( !entry )
        throw new Error( `Could not automatically determine src-path for renderer path '${pkg.rrox.renderer}'. Please manually specify a rendererEntry path.` );

    const config = {
        target: 'web',
        entry : {},
        output: {
            filename: '[name].js',
            path: path.dirname( path.resolve( process.cwd(), pkg.rrox.renderer ) ),
            clean: true,
        },
        plugins: [
            new webpack.container.ModuleFederationPlugin( {
                name   : path.parse( pkg.rrox.renderer ).name,
                library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( pkg.name )}]` },
                exposes: {
                    '.': `./${entry.split( path.win32.sep ).join( path.posix.sep )}`,
                },
                remotes: {}, // TODO:
                shared : SHARED_MODULES.renderer
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