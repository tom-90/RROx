import { BrowserWindow } from 'electron';
import path from 'path';
import { convertEntryPath, focusGame, focusOverlay, getActiveWindow, getGameWindow, isGameFocussed } from '../utils';
import appIcon from '@rrox/assets/images/appIcon.ico';
import { RROxApp } from '../app';
import { screen } from "electron";
import { BaseSettings } from '../../shared/settings';
import { OverlayMode } from '@rrox/api';
import { OverlayModeCommunicator } from '../../shared/communicators';

const dir = __dirname;

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_BOOTSTRAP_WEBPACK_ENTRY: string;
declare const APP_WINDOW_BOOTSTRAP_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Create Overlay Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createOverlayWindow( app: RROxApp ): BrowserWindow {
    const settings = app.settings.init( BaseSettings );

    const overlayMode = app.communicator.provideValue( OverlayModeCommunicator );

    // Create new window instance
    let overlayWindow = new BrowserWindow( {
        width: 800,
        height: 600,
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
        skipTaskbar: true,
        frame: false,
        transparent: true,
        resizable: false,
        show: false,
    } );

    let url = convertEntryPath( APP_WINDOW_BOOTSTRAP_WEBPACK_ENTRY );
    url.searchParams.append( 'mode', 'overlay' );

    // Load the index.html of the app window.
    overlayWindow.loadURL( url.toString() );

    overlayWindow.setIgnoreMouseEvents( true );
    overlayWindow.setAlwaysOnTop( true, "normal" );
    
    overlayWindow.on( 'ready-to-show', () => {
        overlayWindow.show();
        overlayWindow.minimize();
    } );

    function hide() {
        overlayWindow.minimize();
        overlayWindow.setIgnoreMouseEvents( true );

        overlayMode.provide( OverlayMode.HIDDEN );
    }

    function showUnfocussed() {
        const gameWindow = getGameWindow();

        if ( !gameWindow )
            return;

        const { bounds } = gameWindow;

        if ( overlayWindow.isMinimized() )
            overlayWindow.restore();

        overlayWindow.setIgnoreMouseEvents( true );

        overlayWindow.setBounds( screen.screenToDipRect( overlayWindow, {
            // All numbers need to be convertible to int
            x: Math.floor( bounds.x ),
            y: Math.floor( bounds.y ),
            width: Math.floor( bounds.width ),
            height: Math.floor( bounds.height )
        } ), false );

        focusGame();

        overlayMode.provide( OverlayMode.SHOWN );
    }

    function showFocussed() {
        const gameWindow = getGameWindow();

        if ( !gameWindow )
            return;

        const { bounds } = gameWindow;

        if ( overlayWindow.isMinimized() )
            overlayWindow.restore();
        
        overlayWindow.setIgnoreMouseEvents( false );
        overlayWindow.setBounds( screen.screenToDipRect( overlayWindow, {
            // All numbers need to be convertible to int
            x: Math.floor( bounds.x ),
            y: Math.floor( bounds.y ),
            width: Math.floor( bounds.width ),
            height: Math.floor( bounds.height )
        } ), false );

        overlayMode.provide( OverlayMode.FOCUSSED );
    }

    const interval = setInterval( () => {
        const focussed = isGameFocussed();
        const isOverlayEnabled = settings.get( 'overlay.enabled' );

        const state = overlayMode.getValue();
        if( !focussed && state !== OverlayMode.HIDDEN )
            hide();
        else if( focussed && state === OverlayMode.HIDDEN && isOverlayEnabled )
            showUnfocussed();
    }, 500 );

    let keybindId = -1;

    function registerKeybind() {
        if( keybindId > -1 )
            app.keybinds.removeKeybind( keybindId );
        
        keybindId = app.keybinds.addKeybind( settings.get( 'overlay.keybind' ) );

        app.keybinds.addListener( keybindId, () => {
            const isOverlayEnabled = settings.get( 'overlay.enabled' );
            
            const state = overlayMode.getValue();
            if ( !isOverlayEnabled && !overlayWindow.isMinimized() ) {
                hide();
                focusGame();
            } else if ( isOverlayEnabled && state !== OverlayMode.SHOWN ) {
                showUnfocussed();
                focusGame();
            } else if ( !isOverlayEnabled || state === OverlayMode.SHOWN ) {
                showFocussed();
                setTimeout( async () => {
                    let attempts = 0;
                    while( getActiveWindow()?.title !== 'RROxOverlay' && attempts < 10 ) {
                        focusOverlay();
                        attempts++;
                        await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );
                    }
                }, 50 );
            }
        } );
    }

    const onSettingsUpdate = () => {
        registerKeybind();
    };

    settings.addListener( 'update', onSettingsUpdate );

    registerKeybind();

    overlayWindow.on( 'close', () => {
        clearInterval( interval )
        app.keybinds.removeKeybind( keybindId );
        settings.removeListener( 'update', onSettingsUpdate );
        overlayMode.destroy();
    } );

    return overlayWindow;
}