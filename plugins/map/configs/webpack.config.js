const webpack = require( 'webpack' );
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require( 'path' );

const plugin = require( './plugin.config' );
const package = require( '../package.json' );

const base = {
    module: {
        rules: [
            {
                // Add support for native node modules
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                // Typescript loader
                test: /\.tsx?$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                // CSS Loader
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                // Less loader
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { 
                        loader: 'less-loader',
                        options: { 
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    },
                ],
            },
            {
                // SCSS/Sass loader
                test: /\.(scss|sass)$/,
                use: [ "style-loader", "css-loader", "sass-loader" ],
            },
            {
                // Assets loader
                // More information here https://webpack.js.org/guides/asset-modules/
                test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2|ico)$/i,
                type: 'asset',
                generator: {
                    filename: 'assets/[hash][ext][query]',
                },
            }
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin( {
            PluginInfo: JSON.stringify({
                name: plugin.name,
                version: package.version,
            })
        } )
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
    devtool: process.env.NODE_ENV == 'development' ? 'eval-source-map' : 'source-map',
};

const controller = {
    ...base,
    target: 'node',
    entry : {},
    output: {
        filename  : '[name].js',
        path      : path.resolve( __dirname, '../dist/controller' ),
    },
    plugins: [
        ...base.plugins,
        new ModuleFederationPlugin( {
            name   : 'controller',
            library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( plugin.name )}]` },
            exposes: {
                '.': plugin.controllerEntry,
            },
            remotes: {
                '@rrox/world': '__webpack_remotes__.load("@rrox/world")'
            },
        } ),
    ]
};

const renderer = {
    ...base,
    target: 'web',
    entry : {},
    output: {
        filename  : '[name].js',
        path      : path.resolve( __dirname, '../dist/renderer' ),
    },
    plugins: [
        ...base.plugins,
        new ModuleFederationPlugin( {
            name   : 'renderer',
            library: { type: 'assign', name: `__webpack_remotes__[${JSON.stringify( plugin.name )}]` },
            exposes: {
                '.': plugin.rendererEntry,
            },
            remotes: {
                '@rrox/world': '__webpack_remotes__.load("@rrox/world")'
            },
            shared: [
                {
                    'react'           : { singleton: true },
                    'react-dom'       : { singleton: true },
                    'react-router'    : { singleton: true },
                    'react-router-dom': { singleton: true },
                }
            ]
        } ),
    ]
}

module.exports = [ controller, renderer ];