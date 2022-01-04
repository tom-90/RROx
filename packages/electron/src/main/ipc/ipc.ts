import { ipcMain } from "electron";
import { Task } from "../tasks/task";
import Log from 'electron-log';
import { RROx } from "../rrox";

export abstract class IPCTask extends Task {

    /**
     * Whether or not this IPC can be called from the websocket
     */
    public public = false;

    public abstract readonly channel: string;

}

export abstract class IPCListener<P extends any[] = []> extends IPCTask {

    private listener?: ( event?: Electron.IpcMainEvent, ...args: P ) => void;

    constructor( app: RROx ) {
        super( app );

        this.app.socket.on( 'listener-event', ( type, args: P ) => {
            if( type !== this.channel || !this.listener || !this.public )
                return;
            this.listener( null, ...args );
        } );
    }

    public start(): void {
        if( this.listener )
            return;
        
        this.listener = ( event, ...args ) => {
            let res = this.onMessage( ...args );
            if( res instanceof Promise )
                res.catch( ( e ) => Log.error( `Error while handling IPC Event '${this.taskName}':`, e ) );    
        }

        ipcMain.on( this.channel, this.listener );
    }

    public stop(): void {
        if( !this.listener )
            return;
        ipcMain.removeListener( this.channel, this.listener );
        this.listener = null;
    }

    protected abstract onMessage( ...args: P ): void | Promise<void>;


}

export abstract class IPCHandler<P extends any[] = []> extends IPCTask {

    private handler?: ( event: Electron.IpcMainInvokeEvent | string, ...args: P ) => any;

    constructor( app: RROx ) {
        super( app );

        this.app.socket.on( 'handler-event', ( type, args: P, callback: ( data: any ) => void ) => {
            if ( type !== this.channel || !this.handler || !this.public )
                return;
            
            let res = this.handler( null, ...args );

            if( res instanceof Promise )
                res.then( callback ).catch( ( e ) => Log.error( `Error while executing IPC Handler from websocket '${this.taskName}':`, e ) );
            else
                callback( res );
        } );
    }

    public start(): void {
        if( this.handler )
            return;
        this.handler = ( event, ...args ) => this.handle( ...args );
        ipcMain.handle( this.channel, this.handler );
    }

    public stop(): void {
        if( !this.handler )
            return;
        ipcMain.removeHandler( this.channel );
        this.handler = null;
    }

    protected abstract handle( ...args: P ): any | Promise<any>;

}