import { app, BrowserWindow } from 'electron';
import { convertEntryPath } from '../utils/urlPath';
import path from 'path';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
    // Create new window instance
    let appWindow = new BrowserWindow( {
        width: 800,
        height: 800,
        backgroundColor: '#1f252c',
        show: false,
        autoHideMenuBar: true,
        icon: path.resolve( 'assets/images/appIcon.ico' ),
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    } );

    // Load the index.html of the app window.
    appWindow.loadURL( convertEntryPath( APP_WINDOW_WEBPACK_ENTRY ).toString() );

    // Show window when its ready to
    appWindow.on( 'ready-to-show', () => appWindow.show() );

    // Close all windows when main window is closed
    appWindow.on( 'close', () => {
        app.quit();
    } );

    return appWindow;
}