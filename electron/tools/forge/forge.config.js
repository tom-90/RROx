// Forge Configuration
const path = require( 'path' );
const rootDir = process.cwd();

module.exports = {
    // Packager Config
    packagerConfig: {
        // Set executable name
        executableName: 'RailroadsOnline Extended',
        icon: path.resolve( __dirname, '../../assets/images/appIcon.ico'),
    },
    // Forge Makers
    makers: [
        {
            // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
            // Windows applications and is therefore the most user friendly you can get.
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'RailroadsOnlineExtended',
                setupIcon: path.resolve( __dirname, '../../assets/images/appIcon.ico'),

                // TO ADD:
                // iconUrl: 'https://github.com/.../icon.ico?raw=true'
            },
        }
    ],
    // Forge Plugins
    plugins: [
        [
            // The Webpack plugin allows you to use standard Webpack tooling to compile both your main process code
            // and your renderer process code, with built in support for Hot Module Reloading in the renderer
            // process and support for multiple renderers.
            '@electron-forge/plugin-webpack',
            {
                // fix content-security-policy error when image or video src isn't same origin
                devContentSecurityPolicy: '',
                // Ports
                port: 3000, // Webpack Dev Server port
                loggerPort: 9000, // Logger port
                // Main process webpack configuration
                mainConfig: path.join( rootDir, 'tools/webpack/webpack.main.js' ),
                // Renderer process webpack configuration
                renderer: {
                    // Configuration file path
                    config: path.join( rootDir, 'tools/webpack/webpack.renderer.js' ),
                    // Entrypoints of the application
                    entryPoints: [
                        {
                            // Window process name
                            name: 'app_window',
                            // React Hot Module Replacement (HMR)
                            rhmr: 'react-hot-loader/patch',
                            // HTML index file template
                            html: path.join( rootDir, 'src/renderer/app.html' ),
                            // Renderer
                            js: path.join( rootDir, 'src/renderer/appRenderer.tsx' ),
                            // Main Window
                            // Preload
                            preload: {
                                js: path.join( rootDir, 'src/renderer/appPreload.tsx' ),
                            },
                        },
                    ],
                },
                devServer: {
                    liveReload: false,
                },
            },
        ]
    ],
};
