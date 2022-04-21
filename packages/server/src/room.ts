import { Server as SocketServer, Socket } from 'socket.io';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { applyDiff } from './utils';

export class Room {
    public static readonly SIGNING_KEY = process.env.JWT_KEY || 'tmp';

    private clients: Socket[] = [];
    private valueProviders: { [ channel: string ]: any } = {};

    constructor(
        private manager: RoomManager,
        private io: SocketServer,
        private host: Socket,
        public readonly key: string
    ) {
        host.on( 'broadcast', ( type: string, data: any[] ) => {
            if( Object.keys( this.valueProviders ).includes( type ) )
                this.valueProviders[ type ] = applyDiff( this.valueProviders[ type ], data[ 0 ] );

            this.io.to( this.key ).emit( 'broadcast', type, data );
        } );

        host.on( 'disconnect', () => {
            this.destroy();
        } );

        host.on( 'value-providers', ( valueProviders: { channel: string, value: any }[] ) => {
            if( !Array.isArray( valueProviders ) )
                return;

            for( let vp of valueProviders ) {
                if( typeof vp !== 'object' || vp == null || typeof vp.channel !== 'string' )
                    continue;

                this.valueProviders[ vp.channel ] = vp.value;
            }

            console.log( 'value-providers', this.valueProviders );
        } );
    }
    
    /**
     * Configure a client socket
     *
     * @param socket 
     */
    public addClient( socket: Socket, type: 'public' | 'private' ) {
        // Configure client to listen for all host broadcasts
        socket.join( this.key );

        // Listen for rpcs sent by the client and forward them to the host room
        socket.on( 'rpc', ( channel: string, args: any[], ack?: ( res: any ) => void ) => {
            if( type === 'private' )
                this.host.emit( 'rpc', channel, args, ack );
            else if( ack && Object.keys( this.valueProviders ).includes( channel ) )
                ack( this.valueProviders[ channel ] );
        } );

        this.clients.push( socket );

        socket.on( 'disconnect', () => {
            this.clients = this.clients.filter( ( c ) => c !== socket );
        } );
    }

    public destroy() {
        this.clients.forEach( ( c ) => c.disconnect() );
        this.clients = [];

        this.host.disconnect();

        this.manager.rooms.delete( this.key );
    }

    public getPublicKey() {
        return jwt.sign( {
            key: this.key,
            type: 'public',
        }, Room.SIGNING_KEY );
    }

    public getPrivateKey() {
        return jwt.sign( {
            key: this.key,
            type: 'private',
        }, Room.SIGNING_KEY );
    }
}

export class RoomManager {
    public readonly rooms: Map<string,Room> = new Map();

    constructor( private io: SocketServer ) {}

    public create( socket: Socket ) {
        const key = crypto.randomBytes( 10 ).toString( 'hex' ).toUpperCase();

        let room = new Room( this, this.io, socket, key );

        this.rooms.set( key, room );

        return room;
    }

    public join( socket: Socket, key: string ): false | 'public' | 'private' {
        try {
            const data = jwt.verify( key, Room.SIGNING_KEY );

            if( typeof data !== 'object' || data.key == null || data.type == null )
                return false;

            if( !this.rooms.has( data.key ) )
                return false;
    
            const room = this.rooms.get( data.key )!;

            room.addClient( socket, data.type );

            return data.type;
        } catch( e ) {
            return false;
        }
    }

}