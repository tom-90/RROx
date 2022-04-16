module.exports = {
    /**
     * Name of the plugin (extracted from package.json)
     */
    name: require( '../package.json' ).name,

    /**
     * Path to the entry file of the controller (relative to package root)
     */
    controllerEntry: './src/controller/index.ts',

    /**
     * Path to the entry file of the renderer (relative to package root)
     */
    rendererEntry: './src/renderer/index.tsx',

    sharedEntry: './src/shared/index.ts',
}