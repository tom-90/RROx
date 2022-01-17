import { io, Socket } from 'socket.io-client';
import EventEmitter from 'events';
import Log from 'electron-log';

export declare interface SocketConnection {
    on( event: 'handler-event'  , listener: ( type: string, args: any[], callback: ( data: any ) => void ) => void ): this;
    on( event: 'listener-event' , listener: ( type: string, args: any[]                                  ) => void ): this;
    on( event: 'broadcast-event', listener: ( type: string, args: any[]                                  ) => void ): this;
    on( event: 'disconnect'     , listener: (                                                            ) => void ): this;
    on( event: 'host-connect'   , listener: (                                                            ) => void ): this;
    on( event: 'join'           , listener: (                                                            ) => void ): this;
}

export enum SocketMode {
    HOST = "host",
    CLIENT = "client",
}

export class SocketConnection extends EventEmitter {

    public static readonly SOCKET_SERVER = 'https://rrox.tom90.nl';

    private socket?: Socket;
    public mode?: SocketMode;
    public key?: string;

    private connect( mode: SocketMode ) {
        if( this.socket )
            throw new Error( 'Already connected.' );

        this.socket = io( SocketConnection.SOCKET_SERVER, {
            transports  : [ 'websocket' ],
            reconnection: false,
            extraHeaders: {
                'User-Agent': 'RROX'
            }
        } );
        this.mode = mode;

        this.socket.on( 'connect_error', ( error ) => {
            Log.error( 'Socket connect error', error );
            this.socket = undefined;
            this.mode = undefined;
            this.key = undefined;
            this.emit( 'disconnect' );
        } );

        this.socket.on( 'disconnect', ( reason ) => {
            Log.error( 'Socket disconnected. Reason:', reason );
            this.socket = undefined;
            this.mode = undefined;
            this.key = undefined;
            this.emit( 'disconnect' );
        } );

        if( mode === SocketMode.HOST ) {
            this.socket.on( 'rpc', ( type: string, args: any[], ack?: ( res: any ) => void ) => {
                if ( !ack )
                    this.emit( 'listener-event', type, args );
                else
                    this.emit( 'handler-event', type, args, ack );
            } );
        } else if( mode === SocketMode.CLIENT ) {
            this.socket.on( 'broadcast', ( channel: string, args: any[] ) => {
                this.emit( 'broadcast-event', channel, args );
            } );
        }
    }

    private disconnect() {
        this.socket.close();
    }

    public isActive() {
        return this.socket != null;
    }

    public broadcast( channel: string, ...data: any[] ) {
        if( !this.socket || this.mode !== SocketMode.HOST )
            throw new Error( 'Socket not available' );
        
        this.socket.emit( 'broadcast', channel, data );
    }

    public invoke<T>( type: string, ...args: any[] ): Promise<T> {
        if( !this.socket || this.mode !== SocketMode.CLIENT )
            throw new Error( 'Socket not available' );
        return new Promise( ( resolve ) => {
            this.socket.emit( 'rpc', type, args, ( res: T ) => resolve( res ) );
        } );
    }

    public send( type: string, ...args: any[] ) {
        if( !this.socket || this.mode !== SocketMode.CLIENT )
            throw new Error( 'Socket not available' );
        this.socket.emit( 'rpc', type, args );
    }

    public join( key: string ): Promise<void> {
        if( this.socket && this.mode !== SocketMode.CLIENT )
            throw new Error( 'Socket not available' );
        
        if( this.socket ) {
            this.disconnect();
        }
        
        this.connect( SocketMode.CLIENT );

        return new Promise<void>( ( resolve, reject ) => {
            const onDisconnect = () => {
                reject( 'Unable to connect to server.' );
            };

            this.socket.emit( 'join', key, ( success: boolean ) => {
                this.removeListener( 'disconnect', onDisconnect );

                if( !success ) {
                    this.disconnect();
                    return reject( 'Key is invalid' );
                }

                this.key = key;

                this.emit( 'join' );

                resolve();
            } );

            this.once( 'disconnect', onDisconnect );
        } );
    }

    public leave() {
        if( !this.socket )
            return;
        if( this.mode !== SocketMode.CLIENT )
            throw new Error( 'Socket not available' );

        this.disconnect();
    }

    public createHostSession() {
        if( this.socket && this.mode !== SocketMode.HOST )
            throw new Error( 'Socket not available' );
        
        if( this.socket ) {
            this.disconnect();
        }

        this.connect( SocketMode.HOST );

        return new Promise<string>( ( resolve, reject ) => {
            const onDisconnect = () => {
                reject( 'Unable to connect to server.' );
            };

            this.socket.emit( 'create', ( res: string ) => {
                this.removeListener( 'disconnect', onDisconnect );
        
                this.key = res;
                
                this.emit( 'host-connect' );

                resolve( res );
            } );

            this.once( 'disconnect', onDisconnect );
        } );
    }

    public stopHostSession() {
        if( !this.socket )
            return;
        if( this.mode !== SocketMode.HOST )
            throw new Error( 'Socket not available' );

        this.disconnect();
    }

    public getKeyFromURL( url: string ) {
        if( !url.startsWith( SocketConnection.SOCKET_SERVER + '/' ) )
            return url;
        return url.substring( SocketConnection.SOCKET_SERVER.length + 1 );
    }

    public getURLFromKey( key: string ) {
        return `${SocketConnection.SOCKET_SERVER}/${key}`;
    }
}