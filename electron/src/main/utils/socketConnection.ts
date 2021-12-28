import { io, Socket } from 'socket.io-client';
import EventEmitter from 'events';
import Log from 'electron-log';

export declare interface SocketConnection {
    on( event: 'handler-event' , listener: ( type: string, args: any[], callback: ( data: any ) => void ) => void ): this;
    on( event: 'listener-event', listener: ( type: string, args: any[]                                  ) => void ): this;
}

export class SocketConnection extends EventEmitter {

    public static readonly SOCKET_SERVER = 'https://rrox.tom90.nl';

    private socket?: Socket;

    public connect() {
        if( this.socket )
            throw new Error( 'Already connected.' );

        this.socket = io( SocketConnection.SOCKET_SERVER, { transports: [ 'websocket' ] } );

        this.socket.on( 'rpc', ( type: string, args: any[], ack?: ( res: any ) => void ) => {
            if ( !ack )
                this.emit( 'listener-event', type, args );
            else
                this.emit( 'handler-event', type, args, ack );
        } );

        this.socket.on( 'connect_error', ( error ) => {
            Log.error( 'Socket connect error', error );
        } );

        this.socket.on( 'disconnect', ( reason ) => {
            Log.error( 'Socket disconnected. Reason:', reason );
            this.socket = undefined;
        } );

        return new Promise<string>( ( resolve ) => {
            this.socket.emit( 'create', ( res: string ) => {
                resolve( res );
            } );
        } );
    }

    public disconnect() {
        this.socket.close();
    }

    public isActive() {
        return this.socket != null;
    }

    public broadcast( channel: string, ...data: any[] ) {
        if( !this.socket )
            return;
        
        this.socket.emit( 'broadcast', channel, data );
    }


}