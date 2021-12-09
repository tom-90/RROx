import { ipcMain } from "electron";
import { Task } from "../tasks/task";
import Log from 'electron-log';

export abstract class IPCTask extends Task {

    public abstract readonly channel: string;

}

export abstract class IPCListener<P extends any[] = []> extends IPCTask {

    private listener?: ( event: Electron.IpcMainEvent, ...args: P ) => void;

    public start(): void {
        if( this.listener )
            return;
        
        this.listener = ( event, ...args ) => {
            let res = this.onMessage( event, ...args );
            if( res instanceof Promise )
                res.catch( ( e ) =>  Log.error( `Error while handling IPC Event '${this.taskName}':`, e ) );    
        }

        ipcMain.on( this.channel, this.listener );
    }

    public stop(): void {
        if( !this.listener )
            return;
        ipcMain.removeListener( this.channel, this.listener );
        this.listener = null;
    }

    protected abstract onMessage( event: Electron.IpcMainEvent, ...args: P ): void | Promise<void>;

}

export abstract class IPCHandler<P extends any[] = []> extends IPCTask {

    private handler?: ( event: Electron.IpcMainEvent, ...args: P ) => any;

    public start(): void {
        if( this.handler )
            return;
        this.handler = ( event, ...args ) => this.handle( event, ...args );
        ipcMain.handle( this.channel, this.handler );
    }

    public stop(): void {
        if( !this.handler )
            return;
        ipcMain.removeHandler( this.channel );
        this.handler = null;
    }

    protected abstract handle( event: Electron.IpcMainEvent, ...args: P ): any | Promise<any>;

}