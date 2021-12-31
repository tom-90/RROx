module.exports = {
    ...require( './webpack.base' ),
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: ['./src/main/app.ts'],
    target: 'electron-main',
};
