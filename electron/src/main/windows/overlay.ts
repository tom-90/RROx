import { BrowserWindow } from 'electron';
import path from 'path';
import { convertEntryPath } from '../utils';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Create Overlay Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createOverlayWindow(): BrowserWindow {
    // Create new window instance
    let overlayWindow = new BrowserWindow( {
        width: 800,
        height: 600,
        icon: path.resolve( 'assets/images/appIcon.ico' ),
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        skipTaskbar: true,
        frame: false,
        transparent: true,
        resizable: false,
        show: false,
    } );

    let url = convertEntryPath( APP_WINDOW_WEBPACK_ENTRY );
    url.searchParams.append( 'mode', 'overlay' );

    // Load the index.html of the app window.
    overlayWindow.loadURL( url.toString() );

    overlayWindow.setIgnoreMouseEvents( true );
    overlayWindow.setAlwaysOnTop( true, "normal" );

    return overlayWindow;
}