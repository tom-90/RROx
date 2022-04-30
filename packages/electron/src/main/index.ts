import { app, autoUpdater, BrowserWindow, dialog, session } from 'electron';
import Updater from 'update-electron-app';
import Log from 'electron-log';
import path from 'path';
import { RROxApp } from './app';
import { createAppWindow, createOverlayWindow } from './windows';
import { Logger } from '@rrox/api';
import { BaseSettings } from '../shared/settings';

if ( require( 'electron-squirrel-startup' ) || ( process.env.NODE_ENV !== 'development' && !app.requestSingleInstanceLock() ) ) {
    app.quit();
} else if( app.getAppPath().includes( '\\AppData\\Local\\RailroadsOnlineExtended') ) {
    // Stop auto update from v1
    Log.info( 'Disabling app due to install location', app.getAppPath() );
    app.on( 'ready', () => {
        dialog.showMessageBox( {
            type   : 'error',
            buttons: [ 'Close' ],
            title  : 'Auto-update not supported',
            message: 'To use the new version of RROx, please uninstall the current version and manually install the new version from the RROx site.'
        } ).then( () => {
            app.quit();
        } );
    } );
} else {    
    // Make logger available for plugins
    new Logger( Log );

    Updater( {
        logger    : Log,
        notifyUser: false, // We manually notify the user with a custom message
    } );

    autoUpdater.on( 'update-downloaded', ( event, releaseNotes, releaseName, releaseDate, updateURL ) => {
        Log.log( 'update-downloaded', [ event, releaseNotes, releaseName, releaseDate, updateURL ] )

        const dialogOpts = {
            type: 'info',
            buttons: [ 'Restart', 'Later' ],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version is available. Before updating, please shut down the game, if it is running.'
        }

        dialog.showMessageBox( dialogOpts ).then( ( { response } ) => {
            if ( response === 0 ) autoUpdater.quitAndInstall()
        } );
    } );

    if ( process.defaultApp ) {
        if ( process.argv.length >= 2 ) {
            app.setAsDefaultProtocolClient( 'rrox', process.execPath, [ path.resolve( process.argv[ 1 ] ) ] )
        }
    } else {
        app.setAsDefaultProtocolClient( 'rrox' )
    }

    let openURL = process.argv.find( ( arg ) => arg.startsWith( 'rrox://' ) );

    let rrox = new RROxApp();
    const settings = rrox.settings.init( BaseSettings );

    if( !settings.get( 'hardware-acceleration' ) ) {
        app.disableHardwareAcceleration();
        Log.info( 'Hardware acceleration is disabled.' );
    } else
        Log.info( 'Hardware acceleration is enabled.' );

    let appWindow: BrowserWindow | undefined = undefined;

    app.on( 'ready', async () => {
        try {
            if( process.env.NODE_ENV === 'development' && process.env.LOCALAPPDATA ) {
                await session.defaultSession.loadExtension( path.resolve( process.env.LOCALAPPDATA, 'Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.24.3_0' ) );
            }
        } catch( e ) {}

        await rrox.plugins.loadInstalledPlugins();

        appWindow = createAppWindow();
        rrox.addWindow( appWindow );
        rrox.addWindow( createOverlayWindow( rrox ) );
        
        if( openURL )
            handleOpenURL( openURL );

        if( settings.get( 'first-install' ) ) {
            settings.set( 'first-install', false );

            await rrox.plugins.installDefaultPlugins();
        }
    } );

    app.on( 'second-instance', ( e, argv ) => {
        let openURL = argv.find( ( arg ) => arg.startsWith( 'rrox://' ) );
        if( openURL )
            handleOpenURL( openURL );

        if (appWindow) {
            if (appWindow.isMinimized()) {
                appWindow.restore();
            }

            appWindow.focus();
        }
    });

    app.on( 'window-all-closed', () => {
        app.quit();
    } );

    const handleOpenURL = async ( url: string ) => {
        if( url && url.startsWith( 'rrox://key/' ) ) {
            const key = url.substring( 'rrox://key/'.length );
            if( key ) {
                try {
                    Log.info( 'Joining remote session using key', key );
                    await rrox.shared.join( key );
                } catch( e ) {
                    Log.error( 'Failed to connect to shared session', e );
                    dialog.showMessageBox( {
                        type: 'error',
                        title: 'Invalid key',
                        message: 'Could not join the remote session because RROx could not connect to the server using the key.'
                    } );
                }
            }
        }
    }
}