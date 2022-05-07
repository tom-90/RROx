const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const relocateLoader = require('@vercel/webpack-asset-relocator-loader');
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const package = require("../../package.json");

module.exports = {
    // Put your normal webpack config below here
    module: {
        rules: [
            {
                // Add support for native node modules
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                // Webpack asset relocator loader
                test: /\.(m?js|node)$/,
                parser: { amd: false },
                use: {
                    loader: '@vercel/webpack-asset-relocator-loader',
                    options: {
                        outputAssetBase: 'native_modules',
                    },
                },
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
            },
            {
                // Assets loader
                // More information here https://webpack.js.org/guides/asset-modules/
                test: /\.(exe|dll)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext][query]',
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
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin( {
            PluginInfo: JSON.stringify({
                name: "@rrox/electron",
                version: package.version,
            })
        } ),
        {
            apply( compiler ) {
                compiler.hooks.compilation.tap(
                    'webpack-asset-relocator-loader',
                    ( compilation ) => {
                        relocateLoader.initAssetCache( compilation, 'native_modules' );
                    },
                );
            },
        },
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
    stats: 'minimal',
    devtool: process.env.NODE_ENV == 'development' ? 'eval-source-map' : 'source-map',
};
