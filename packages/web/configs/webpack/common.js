// shared config (dev and prod)
const { resolve } = require( "path" );
const webpack = require( "webpack" );
const { ModuleFederationPlugin } = require( 'webpack' ).container;
const HtmlRendererPlugin = require( "./html" );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const package = require("../../package.json");

module.exports = {
    resolve: {
        extensions: [ '.js', '.ts', '.jsx', '.tsx', '.css', '.json' ],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    context: resolve( __dirname, "../../" ),
    module: {
        rules: [
            {
                // CSS loader
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ],
            },
            {
                // SCSS/Sass loader
                test: /\.(scss|sass)$/,
                use: [ "style-loader", "css-loader", "sass-loader" ],
            },
            {
                // Lazy Less loader
                test: /\.lazy.less$/,
                use: [
                    { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
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
                // Less loader
                test: /\.less$/,
                exclude: /\.lazy.less$/,
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
                // Assets loader
                // More information here https://webpack.js.org/guides/asset-modules/
                test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2|ico)$/i,
                type: 'asset',
                generator: {
                    filename: 'assets/[hash][ext][query]',
                },
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source',
            },
            {
                resourceQuery: /file/,
                type: 'asset/resource',
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin( {
            PluginInfo: JSON.stringify({
                name: "@rrox/electron",
                version: package.version,
            })
        } ),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlRendererPlugin( {
            template: "src/index.html.ejs",
            favicon: require.resolve( "@rrox/assets/images/appIcon.ico" ),
        } ),
        new ModuleFederationPlugin( {
            name   : 'renderer',
            library: { type: 'assign', name: `__webpack_remotes__["@rrox/electron"]` },
            exposes: {
                '.': './src/index.tsx'
            },
            shared: [
                {
                    'react'           : { singleton: true },
                    'react-dom'       : { singleton: true },
                    'react-router'    : { singleton: true },
                    'react-router-dom': { singleton: true },
                    '@rrox/base-ui'   : { singleton: true },
                }
            ]
        } )
    ],
};