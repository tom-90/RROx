import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { ConfigAPI } from '../types.js';
import webpack from 'webpack';
import { checkEntryPath, getPluginDependencies } from '../utils.js';
import { SHARED_MODULES } from '../definitions/shared.js';

export async function getControllerWebpackConfig( api: ConfigAPI ) {
    let entry = api.package.rrox.controllerEntry;

    if( !entry ) // Check dist path with extension replaced with ts
        entry = await checkEntryPath( api.package.rrox.controller, '.ts' );
    if( !entry ) // Check dist path as is
        entry = await checkEntryPath( api.package.rrox.controller );
    if( !entry ) // Check dist path with filename replaced with 'index.ts'
        entry = await checkEntryPath( api.package.rrox.controller, '.ts', 'index.ts' );
    if( !entry ) // Check dist path with filename replaced with 'index.js'
        entry = await checkEntryPath( api.package.rrox.controller, '.js', 'index.js' );

    if( !entry )
        throw new Error( `Could not automatically determine src-path for controller path '${api.package.rrox.controller}'. Please manually specify a controllerEntry path.` );

    const remotes: { [ plugin: string ]: string } = {};
    for( let dep of getPluginDependencies( api.package ) )
        remotes[ dep ] = `__webpack_remotes__.load(${JSON.stringify( dep )})`;

    const entryStr = `./${entry.split( path.win32.sep ).join( path.posix.sep )}`;

    api.controller.sharing.expose( '.', api.development ? [
        'webpack/hot/poll?1000',
        entryStr
    ] : entryStr );

    for( let [ key, config ] of Object.entries( SHARED_MODULES.controller ) )
        api.controller.sharing.share( key, config );

    const sharing = api.controller.sharing.getConfig();

    const config = {
        target: 'electron-main',
        entry : {},
        output: {
            filename: '[name].js',
            path: path.dirname( path.resolve( process.cwd(), api.package.rrox.controller ) )
        },
        plugins: [
            new webpack.container.ModuleFederationPlugin( {
                name   : path.parse( api.package.rrox.controller ).name,
                library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( api.package.name )}]` },
                exposes: sharing.exposed,
                shared : sharing.shared,
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

    api.controller.merge( config );
}