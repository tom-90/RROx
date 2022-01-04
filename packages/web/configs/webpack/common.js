// shared config (dev and prod)
const { resolve } = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );

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
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin( { template: "src/index.html.ejs" } )
    ],
};
