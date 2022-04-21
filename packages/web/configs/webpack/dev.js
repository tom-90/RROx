// development config
const { merge } = require( "webpack-merge" );
const commonConfig = require( "./common" );

module.exports = merge( commonConfig, {
    mode: "development",
    entry: [
        "webpack-dev-server/client?http://localhost:8080", // bundle the client for webpack-dev-server and connect to the provided endpoint
        "./src/bootstrap.ts", // the entry point of our app
    ],
    devServer: {
        hot: "only", // enable HMR on the server
        historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url 
    },
    output: {
        filename: "js/[name].js",
        publicPath: "/",
    },
    devtool: "cheap-module-source-map",
    plugins: [],
} );