import { app, autoUpdater, dialog } from 'electron';
import Updater from 'update-electron-app';
import Logger from 'electron-log';
import { createAppWindow, createOverlayWindow, WindowType } from './windows';
import { RROx } from './rrox';
import { BuildSplineAction, ChangeSwitchAction, EnsureInGameAction, InjectDLLAction, MinizwergColorsAction, MinizwergUploadAction, ReadAddressAction, ReadAddressValueAction, ReadHeightAction, ReadPlayerAddress, ReadWorldAction, SaveAction, SetAddressValueAction, SetEngineControlsAction, SetMoneyAndXPAction, ShowInjectorAction, TeleportAction, TogglePauseAction, VegetationSpawnersAction } from './actions';
import { AutosaveIPCListener, BuildSplineIPCHandler, ChangeSwitchIPCListener, EnabledFeaturesIPCHandler, GetAttachedStateIPCHandler, GetSocketStateIPCHandler, GetVersionIPCHandler, KillDanglingInjector, LogIPCListener, MapDataIPCHandler, MinizwergColorsIPCHandler, OpenLogIPCListener, ReadHeightIPCHandler, SetAttachedStateIPCListener, SetCheatsIPCListener, SetEngineControlsIPCListener, SetMoneyAndXPIPCListener, SetSocketStateIPCHandler, SetSyncControlsIPCListener, ShowInjectorIPCListener, TeleportIPCListener, UpdateConfigIPCListener, PathDataIPCHandler } from './ipc';
import { AttachTask, AutosaveTask, CheatsTask, ControlsSyncTask, KeybindsTask, LoggerTask, OverlayTask, ReadWorldTask } from './tasks';
import './types';
import path from 'path';

const singleInstanceLock = process.env.NODE_ENV === 'development' ? true : app.requestSingleInstanceLock();

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if ( require( 'electron-squirrel-startup' ) || !singleInstanceLock) {
    app.quit();
} else {
    Updater( {
        logger    : Logger,
        notifyUser: false, // We manually notify the user with a custom message
    } );

    autoUpdater.on( 'update-downloaded', ( event, releaseNotes, releaseName, releaseDate, updateURL ) => {
        Logger.log( 'update-downloaded', [ event, releaseNotes, releaseName, releaseDate, updateURL ] )

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

    let rrox: RROx;
    app.on( 'ready', async () => {
        rrox = new RROx();

        rrox.addWindow( WindowType.App    , createAppWindow    () );
        rrox.addWindow( WindowType.Overlay, createOverlayWindow() );

        // Initialize all actions
        const actions = [
            BuildSplineAction,
            ChangeSwitchAction,
            EnsureInGameAction,
            InjectDLLAction,
            MinizwergColorsAction,
            MinizwergUploadAction,
            ReadAddressAction,
            ReadAddressValueAction,
            ReadHeightAction,
            ReadPlayerAddress,
            ReadWorldAction,
            SaveAction,
            SetAddressValueAction,
            SetEngineControlsAction,
            SetMoneyAndXPAction,
            ShowInjectorAction,
            TeleportAction,
            TogglePauseAction,
            VegetationSpawnersAction
        ];
        rrox.createActions( actions );

        // Initialize all tasks and autostart all (except for attach)
        const tasks = [
            AttachTask,
            AutosaveTask,
            CheatsTask,
            ControlsSyncTask,
            ReadWorldTask,
            KeybindsTask,
            LoggerTask,
            OverlayTask
        ];
        rrox.createTasks( tasks );
        await rrox.startTasks( tasks.filter( ( t ) => t !== AttachTask ) );

        // Initialize and start all IPC tasks
        const ipc = [
            BuildSplineIPCHandler,
            AutosaveIPCListener,
            ChangeSwitchIPCListener,
            GetAttachedStateIPCHandler,
            GetSocketStateIPCHandler,
            GetVersionIPCHandler,
            KillDanglingInjector,
            LogIPCListener,
            EnabledFeaturesIPCHandler,
            MapDataIPCHandler,
            MinizwergColorsIPCHandler,
            OpenLogIPCListener,
            ReadHeightIPCHandler,
            SetAttachedStateIPCListener,
            SetCheatsIPCListener,
            SetEngineControlsIPCListener,
            SetMoneyAndXPIPCListener,
            SetSocketStateIPCHandler,
            SetSyncControlsIPCListener,
            ShowInjectorIPCListener,
            UpdateConfigIPCListener,
            TeleportIPCListener,
            PathDataIPCHandler,
        ];
        rrox.createTasks( ipc );
        await rrox.startTasks( ipc );

        // Clear config key on restart
        rrox.settings.delete( 'multiplayer.client.playerName' );

        if( openURL )
            rrox.getWindow( WindowType.App ).once( 'show', () => {
                rrox.getTask( SetSocketStateIPCHandler ).handleURL( openURL );
            } );
    } );

    app.on( 'second-instance', ( e, argv ) => {
        let openURL = argv.find( ( arg ) => arg.startsWith( 'rrox://' ) );
        if( openURL )
            rrox.getTask( SetSocketStateIPCHandler )?.handleURL( openURL );

        let window = rrox?.getWindow(WindowType.App);
        if (window) {
            if (window.isMinimized()) {
                window.restore();
            }

            window.focus();
        }
    });

    app.on( 'window-all-closed', () => {
        app.quit();
    } );
}