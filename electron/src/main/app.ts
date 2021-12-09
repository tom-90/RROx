import { app } from 'electron';
import { createAppWindow, createOverlayWindow, WindowType } from './windows';
import { RROx } from './rrox';
import { ChangeSwitchAction, EnsureInGameAction, InjectDLLAction, ReadAddressAction, ReadAddressValueAction, ReadWorldAction, SaveAction, SetEngineControlsAction, StopAction } from './actions';
import { AttachTask, AutosaveTask, LoggerTask, OverlayTask, ReadWorldTask } from './tasks';
import { AutosaveIPCListener, ChangeSwitchIPCListener, GetAttachedStateIPCHandler, KillDanglingInjector, MapDataIPCHandler, SetAttachedStateIPCListener, SetEngineControlsIPCListener, UpdateConfigIPCListener } from './ipc';

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if ( require( 'electron-squirrel-startup' ) ) {
    app.quit();
}

app.on( 'ready', async () => {
    let rrox = new RROx();

    rrox.addWindow( WindowType.App    , createAppWindow    () );
    rrox.addWindow( WindowType.Overlay, createOverlayWindow() );

    // Initialize all actions
    const actions = [
        ChangeSwitchAction,
        EnsureInGameAction,
        InjectDLLAction,
        ReadAddressAction,
        ReadAddressValueAction,
        ReadWorldAction,
        SaveAction,
        SetEngineControlsAction,
        StopAction
    ];
    rrox.createActions( actions );

    // Initialize all tasks and autostart all (except for attach)
    const tasks = [
        AttachTask,
        AutosaveTask,
        ReadWorldTask,
        LoggerTask,
        OverlayTask
    ];
    rrox.createTasks( tasks );
    await rrox.startTasks( tasks.filter( ( t ) => t !== AttachTask ) );

    // Initialize and start all IPC tasks
    const ipc = [
        AutosaveIPCListener,
        ChangeSwitchIPCListener,
        GetAttachedStateIPCHandler,
        KillDanglingInjector,
        MapDataIPCHandler,
        SetAttachedStateIPCListener,
        SetEngineControlsIPCListener,
        UpdateConfigIPCListener
    ];
    rrox.createTasks( ipc );
    await rrox.startTasks( ipc );

    rrox.start();
} );

app.on( 'window-all-closed', () => {
    app.quit();
} );