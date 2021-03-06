import webpack from 'webpack';
import { ConfigAPI } from '../types.js';
import path from 'path';
import url from 'url';

export function getBaseWebpackConfig( api: ConfigAPI ) {
    const base: webpack.Configuration = {
        mode: api.development ? 'development' : 'production',
        module: {
            rules: [
                {
                    // Add support for native node modules
                    test: /\.node$/,
                    use: 'node-loader',
                },
                {
                    // JS/JSX Loader
                    test: /\.jsx?$/,
                    exclude: /(node_modules|\.webpack)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [ '@babel/preset-env', '@babel/preset-react' ]
                        }
                    }
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
                }
            ],
        },
        plugins: [
            new webpack.DefinePlugin( {
                PluginInfo: JSON.stringify({
                    name: api.package.name,
                    version: api.package.version,
                })
            } ),
        ],
        resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
        },
        resolveLoader: {
            modules: ['node_modules', path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../../node_modules')],
        },
        devtool: api.development ? 'eval-source-map' : 'source-map',
    };

    api.controller.merge( base );
    api.renderer.merge( base );
}