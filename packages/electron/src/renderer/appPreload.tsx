import { contextBridge, ipcRenderer, shell } from 'electron';
import Store from 'electron-store';
import * as config from '../config';

const store = new Store<config.Schema>( config );

const validChannels = [
    'build-spline',
    'map-data',
    'path-data',
    'map-update',
    'autosave',
    'update-config',
    'control-enabled',
    'change-switch',
    'enabled-features',
    'minizwerg-colors',
    'open-log',
    'log',
    'popup-message',
    'read-height',
    'remove-vegetation',
    'set-money-and-xp',
    'set-engine-controls',
    'get-attached-state',
    'set-attached-state',
    'set-cheats',
    'get-socket-state',
    'set-socket-state',
    'set-sync-controls',
    'set-mode',
    'settings-update',
    'dangling-injector',
    'kill-dangling-injector',
    'get-version',
    'show-injector',
    'teleport',
    'test'
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
    getAll() {
        return store.store
    },
    set( key: string, val: any ) {
        return store.set( key, val );
    },
    reset( key: keyof config.Schema ) {
        return store.reset( key );
    }
} );

contextBridge.exposeInMainWorld( 'openBrowser', ( url: string ) => {
    shell.openExternal( url );
} );