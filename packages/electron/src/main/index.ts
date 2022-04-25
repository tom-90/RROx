import { app, autoUpdater, dialog, session } from 'electron';
import Updater from 'update-electron-app';
import Log from 'electron-log';
import path from 'path';
import { RROxApp } from './app';
import { createAppWindow, createOverlayWindow } from './windows';
import { Logger } from '@rrox/api';
import { BaseSettings } from '../shared/settings';

const singleInstanceLock = process.env.NODE_ENV === 'development' ? true : app.requestSingleInstanceLock();

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if ( require( 'electron-squirrel-startup' ) || !singleInstanceLock) {
    app.quit();
} else {
    Updater( {
        logger    : Log,
        notifyUser: false, // We manually notify the user with a custom message
    } );
    
    // Make logger available for plugins
    new Logger( Log );

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
        } )
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

    app.on( 'ready', async () => {
        // if( process.env.NODE_ENV === 'development' && process.env.LOCALAPPDATA ) {
        //     await session.defaultSession.loadExtension( path.resolve( process.env.LOCALAPPDATA, 'Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.24.3_0' ) );
        // }

        await rrox.plugins.loadInstalledPlugins();

        rrox.addWindow( createAppWindow() );
        rrox.addWindow( createOverlayWindow( rrox ) );
    } );

    app.on( 'second-instance', ( e, argv ) => {
    });

    app.on( 'window-all-closed', () => {
        app.quit();
    } );
}