import { contextBridge, ipcRenderer, shell } from 'electron';
import Store from 'electron-store';
import * as config from '../shared/config';

const store = new Store<config.Schema>( config );

const validChannels = [
    'map-data',
    'map-update',
    'autosave',
    'update-config',
    'control-enabled',
    'change-switch',
    'set-engine-controls',
    'get-attached-state',
    'set-attached-state',
    'set-mode',
    'dangling-injector',
    'kill-dangling-injector',
    'get-version'
];

contextBridge.exposeInMainWorld( 'ipc', {
    invoke: ( channel: string, ...args: any[] ) => {
        if ( validChannels.includes( channel ) )
            return ipcRenderer.invoke( channel, ...args );
        return Promise.reject( 'Invalid channel' );
    },
    send: ( channel: string, ...args: any[] ) => {
        if ( validChannels.includes( channel ) )
            ipcRenderer.send( channel, ...args );
    },
    on: ( channel: string, fn: ( event: Electron.IpcRendererEvent, ...args: any[] ) => void ) => {
        if ( validChannels.includes( channel ) )
            ipcRenderer.on( channel, fn );
        return () => ipcRenderer.removeListener( channel, fn );
    },
    once: ( channel: string, fn: ( event: Electron.IpcRendererEvent, ...args: any[] ) => void ) => {
        if ( validChannels.includes( channel ) )
            ipcRenderer.once( channel, fn );
        return () => ipcRenderer.removeListener( channel, fn );
    }
} );
contextBridge.exposeInMainWorld( 'settingsStore', {
    get( key: string ) {
        return store.get( key );
    },
    set( key: string, val: any ) {
        return store.set( key, val );
    }
} );

contextBridge.exposeInMainWorld( 'openBrowser', ( url: string ) => {
    shell.openExternal( url );
} );