const { ModuleFederationPlugin } = require( 'webpack' ).container;
const base = require( './webpack.base' );

module.exports = {
    ...base,
    plugins: [
        ...base.plugins,
        ( compiler ) => {
            // Kind-of hacky way to disable the ModuleFederationPlugin when compiling the preload script.
            // It is (currently) not possible in electron-forge to load a seperate config for this.
            if( compiler.options.target === 'electron-preload' )
                return;

            const plugin = new ModuleFederationPlugin( {
                name   : 'app_window',
                library: { type: 'assign', name: `__webpack_remotes__["@rrox/electron"]` },
                exposes: {
                    '.': './src/renderer/index.tsx'
                },
                shared: [
                    {
                        'react'           : { singleton: true },
                        'react-dom'       : { singleton: true },
                        'react-router'    : { singleton: true },
                        'react-router-dom': { singleton: true },
                    }
                ]
            } );

            plugin.apply( compiler );
        }
    ]
};
