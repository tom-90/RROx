const { ModuleFederationPlugin } = require( 'webpack' ).container;
const base = require( './webpack.base' );

module.exports = {
    ...base,
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: {
        bootstrap: './src/main/bootstrap.ts'
    },
    target: 'electron-main',
    plugins: [
        ...base.plugins,
        new ModuleFederationPlugin( {
            name    : 'app_main',
            filename: 'app_main.js',
            library : { type: 'assign', name: `__webpack_remotes__["@rrox/electron"]` },
            exposes : {
                '.': './src/main/index.ts'
            }
        } )
    ]
};
