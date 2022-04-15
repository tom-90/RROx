import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import Log from 'electron-log';

let retrievedLog = false;
contextBridge.exposeInMainWorld( 'log', () => {
    // We only allow retrieving once, to disable third-party plugins from getting raw access to the logger object.
    if( retrievedLog )
        return null;
    retrievedLog = true;
    return Log;
} );

let retrievedIPC = false;
contextBridge.exposeInMainWorld( 'ipc', () => {
    // We only allow retrieving once, to disable third-party plugins from getting raw access to the ipc object.
    if( retrievedIPC )
        return null;
    retrievedIPC = true;
    return {
        invoke: ( channel: string, ...args: any[] ) => {
            return ipcRenderer.invoke( channel, ...args );
        },
        send: ( channel: string, ...args: any[] ) => {
            ipcRenderer.send( channel, ...args );
        },
        on: ( channel: string, fn: ( ...args: any[] ) => void ) => {
            const listener = ( _: IpcRendererEvent, ...args: any[] ) => fn( ...args );
            ipcRenderer.on( channel, listener );
            return () => ipcRenderer.removeListener( channel, listener );
        }
    }
} );