import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';
import { ConfigAPI } from '../types.js';
import { checkEntryPath, getPluginDependencies } from '../utils.js';
import { SHARED_MODULES } from '../definitions/shared.js';

export async function getRendererWebpackConfig( api: ConfigAPI ) {
    let entry = api.package.rrox.rendererEntry;

    if( !entry ) // Check dist path with extension replaced with ts
        entry = await checkEntryPath( api.package.rrox.renderer, '.ts' );
    if( !entry ) // Check dist path with extension replaced with tsx
        entry = await checkEntryPath( api.package.rrox.renderer, '.tsx' );
    if( !entry ) // Check dist path as is
        entry = await checkEntryPath( api.package.rrox.renderer );
    if( !entry ) // Check dist path with extension replaced with jsx
        entry = await checkEntryPath( api.package.rrox.renderer, '.jsx' );
    if( !entry ) // Check dist path with filename replaced with 'index.ts'
        entry = await checkEntryPath( api.package.rrox.renderer, '.ts', 'index.ts' );
    if( !entry ) // Check dist path with filename replaced with 'index.tsx'
        entry = await checkEntryPath( api.package.rrox.renderer, '.tsx', 'index.tsx' );
    if( !entry ) // Check dist path with filename replaced with 'index.js'
        entry = await checkEntryPath( api.package.rrox.renderer, '.js', 'index.js' );
    if( !entry ) // Check dist path with filename replaced with 'index.jsx'
        entry = await checkEntryPath( api.package.rrox.renderer, '.jsx', 'index.jsx' );

    if( !entry )
        throw new Error( `Could not automatically determine src-path for renderer path '${api.package.rrox.renderer}'. Please manually specify a rendererEntry path.` );

    const remotes: { [ plugin: string ]: string } = {};
    for( let dep of getPluginDependencies( api.package ) )
        remotes[ dep ] = `__webpack_remotes__.load(${JSON.stringify( dep )})`;

    for( let [ key, config ] of Object.entries( SHARED_MODULES.renderer ) )
        api.renderer.sharing.share( key, config );

    api.renderer.sharing.expose( '.', `./${entry.split( path.win32.sep ).join( path.posix.sep )}` );

    const sharing = api.renderer.sharing.getConfig();

    const config = {
        target: 'web',
        entry : {},
        output: {
            filename: '[name].js',
            path: path.dirname( path.resolve( process.cwd(), api.package.rrox.renderer ) )
        },
        plugins: [
            new webpack.container.ModuleFederationPlugin( {
                name   : path.parse( api.package.rrox.renderer ).name,
                library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( api.package.name )}]` },
                exposes: sharing.exposed,
                shared: sharing.shared,
                remotes,
            } ),
        ]
    };

    if( entry.endsWith( '.ts' ) || entry.endsWith( '.tsx' ) )
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin( {
                async: true,
                typescript: {
                    mode: 'write-dts',
                    configOverwrite: {
                        include: [
                            `${path.dirname( entry ).split( path.win32.sep ).join( path.posix.sep )}/**/*`
                        ]
                    }
                }
            } )
        );

    api.renderer.merge( config );
}