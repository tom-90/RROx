import { io, Socket } from 'socket.io-client';
import Log from 'electron-log';
import { RROxApp } from '../../app';
import { ValueProvider, ShareMode } from '@rrox/api';
import { ShareConnectHostCommunicator, ShareMessagesCommunicator, ShareKeys, ShareModeCommunicator, ShareConnectClientCommunicator, ShareKeysCommunicator, ShareAccessCommunicator } from '../../../shared/communicators';
import { ShareCommunicator } from './communicator';

export class ShareController {
    public static readonly SOCKET_SERVER = 'http://localhost:3001';
    public static readonly KEY_PATH = 'key';

    private modeProvider: ValueProvider<ShareMode>;
    private keysProvider: ValueProvider<ShareKeys>;
    private accessProvider: ValueProvider<'public' | 'private'>;
    private socket?: Socket;
    private communicator: ShareCommunicator;
    private initialized: boolean = false;

    constructor( private app: RROxApp ) {
        if( !( app.communicator instanceof ShareCommunicator ) )
            throw new Error( 'ShareController requires a ShareCommunicator' );

        this.communicator = app.communicator;

        this.modeProvider   = app.communicator.provideValue( ShareModeCommunicator, ShareMode.NONE );
        this.keysProvider   = app.communicator.provideValue( ShareKeysCommunicator, {} );
        this.accessProvider = app.communicator.provideValue( ShareAccessCommunicator, 'private' );

        app.communicator.listen( ShareMessagesCommunicator, ( channel: string, ...params: any[] ) => {
            if( this.getMode() !== ShareMode.CLIENT || !this.socket )
                return;

            this.socket.emit( 'rpc', channel, params );
        } );

        app.communicator.handle( ShareMessagesCommunicator, ( channel: string, ...params: any[] ) => {
            if( this.getMode() !== ShareMode.CLIENT || !this.socket )
                return;

            return new Promise( ( resolve ) => {
                this.socket!.emit( 'rpc', channel, params, ( res: any ) => resolve( res ) );
            } );
        } );

        app.communicator.handle( ShareConnectHostCommunicator, async ( connect = true ) => {
            if( connect ) {
                const keys = await this.createHostSession();

                this.keysProvider.provide( {
                    public : keys.public ? this.getURLFromKey( keys.public ) : undefined,
                    private: keys.private ? this.getURLFromKey( keys.private ) : undefined,
                } );
            } else {
                this.disconnect();

                this.keysProvider.provide( {} );
            }
        } );

        app.communicator.handle( ShareConnectClientCommunicator, async ( key ) => {
            if( key === null ) {
                this.disconnect();
            } else {
                await this.join( key );
            }
        } );
    }

    private connect( mode: ShareMode ) {
        if( this.socket )
            throw new Error( 'Already connected.' );

        this.socket = io( ShareController.SOCKET_SERVER, {
            transports  : [ 'websocket' ],
            extraHeaders: {
                'User-Agent': 'RROX'
            }
        } );

        this.socket.on( 'disconnect', ( reason ) => {
            Log.error( 'Socket disconnected. Reason:', reason );
            this.socket = undefined;

            if( this.modeProvider.getValue() === ShareMode.CLIENT && this.initialized )
                this.app.windows.forEach( ( w ) => w.reload() );

            this.initialized = false;
            this.modeProvider.provide( ShareMode.NONE );
        } );

        this.modeProvider.provide( mode );

        if( mode === ShareMode.HOST ) {
            this.socket.on( 'rpc', ( type: string, args: any[], ack?: ( res: any ) => void ) => {
                if( !this.isShared( type ) )
                    return;

                try {
                    if ( !ack )
                        this.communicator.callListeners( type, ...args )
                    else {
                        const res = this.communicator.callHandler( type, ...args );
    
                        if( res instanceof Promise )
                            res.then( ack ).catch( ( e ) => Log.error( `Error while executing Handler from websocket '${type}':`, e ) );
                        else
                            ack( res );
                    }
                } catch( e ) {
                    Log.error( e );
                }
            } );
        } else if( mode === ShareMode.CLIENT ) {
            this.socket.on( 'broadcast', ( type: string, args: any[] ) => {
                this.communicator.emit( type, ...args );
            } );
        }
    }

    public disconnect() {
        if( this.socket )
            this.socket.close();
    }

    public isActive() {
        return this.socket != null;
    }

    public getMode() {
        return this.modeProvider.getValue()!;
    }

    public broadcast( channel: string, ...data: any[] ) {
        if( !this.socket || this.getMode() !== ShareMode.HOST )
            return
        
        this.socket.emit( 'broadcast', channel, data );
    }

    public join( key: string ): Promise<void> {
        if( this.socket && this.getMode() !== ShareMode.CLIENT )
            throw new Error( 'Socket not available' );
        
        if( this.socket )
            this.disconnect();
        
        this.connect( ShareMode.CLIENT );

        return new Promise<void>( ( resolve, reject ) => {
            this.socket!.emit( 'join', key, ( mode: boolean | 'public' | 'private' ) => {
                if( !mode ) {
                    this.disconnect();
                    return reject( 'Key is invalid' );
                }

                this.initialized = true;
                this.app.windows.forEach( ( w ) => w.reload() );
                resolve();
            } );
        } );
    }

    public createHostSession() {
        if( this.socket )
            this.disconnect();

        this.connect( ShareMode.HOST );

        return new Promise<ShareKeys>( ( resolve ) => {
            this.socket!.emit( 'create', ( res: ShareKeys ) => {
                this.updateValueProviders();

                this.initialized = true;
                resolve( res );
            } );
        } );
    }

    public getKeyFromURL( url: string ) {
        if( !url.startsWith( ShareController.SOCKET_SERVER + '/' + ShareController.KEY_PATH + '/' ) )
            return url;
        return url.substring( ShareController.SOCKET_SERVER.length + ShareController.KEY_PATH.length + 2 );
    }

    public getURLFromKey( key: string ) {
        return `${ShareController.SOCKET_SERVER}/${ShareController.KEY_PATH}/${key}`;
    }

    public updateValueProviders() {
        if( !this.socket || this.getMode() !== ShareMode.HOST )
            return;

        const valueProviders = this.communicator.getValueProviders();

        this.socket.emit( 'value-providers', valueProviders.map( ( v ) => ( {
            channel: this.communicator.communicatorToChannel( v.getCommunicator() ),
            value  : v.getValue(),
        } ) ) );
    }

    private isShared( communicator: string ) { 
        try {
            const parsed = new URL( communicator, 'https://rrox.tom90.nl' );

            return parsed.searchParams.has( 'shared' ) && parsed.searchParams.get( 'shared' ) === 'true';
        } catch( e ) {
            return false;
        }
    }
}