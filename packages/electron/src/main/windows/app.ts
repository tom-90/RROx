import { app, shell, BrowserWindow } from 'electron';
import { convertEntryPath } from '../utils/urlPath';
import path from 'path';
import appIcon from '@rrox/assets/images/appIcon.ico';

const dir = __dirname;

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_BOOTSTRAP_WEBPACK_ENTRY: string;
declare const APP_WINDOW_BOOTSTRAP_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createAppWindow(): BrowserWindow {

    // Create new window instance
    let appWindow = new BrowserWindow( {
        backgroundColor: '#1f252c',
        show: false,
        autoHideMenuBar: true,
        icon: path.resolve( dir, appIcon ),
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_BOOTSTRAP_PRELOAD_WEBPACK_ENTRY,
            // Disable web security for development as we need to load files from disk (file:///) while using the dev-server on http://localhost:XXXX
            // On production, regular files are loaded using file:/// as well
            webSecurity: process.env.NODE_ENV === 'development' ? false : true
        },
    } );

    // Load the index.html of the app window.
    appWindow.loadURL( convertEntryPath( APP_WINDOW_BOOTSTRAP_WEBPACK_ENTRY ).toString() );

    appWindow.maximize();

    // Show window when its ready to
    appWindow.on( 'ready-to-show', () => appWindow.show() );

    // Close all windows when main window is closed
    appWindow.on( 'close', () => {
        app.quit();
    } );

    appWindow.webContents.on('will-navigate', function (e, url) {
        e.preventDefault();
        shell.openExternal( url );
    });

    return appWindow;
}