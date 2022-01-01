import { Server as SocketServer, Socket } from 'socket.io';
import crypto from 'crypto';

export class Room {

    private clients: Socket[] = [];

    constructor(
        private manager: RoomManager,
        private io: SocketServer,
        private host: Socket,
        public readonly key: string
    ) {
        host.on( 'broadcast', ( type: string, data: any[] ) => {
            this.io.to( this.key ).emit( 'broadcast', type, data );
        } );

        host.on( 'disconnect', () => {
            this.destroy();
        } );
    }

    /**
     * Configure a client socket
     *
     * @param socket 
     */
    public addClient( socket: Socket ) {
        // Configure client to listen for all host broadcasts
        socket.join( this.key );

        // Listen for rpcs sent by the client and forward them to the host room
        socket.on( 'rpc', ( type: string, args: any[], ack?: ( res: any ) => void ) => {
            this.host.emit( 'rpc', type, args, ack );
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

    public join( socket: Socket, key: string ) {
        if ( !key.match( /^[0-9A-F]{20}$/ ) )
            return false;

        if( !this.rooms.has( key ) )
            return false;

        let room = this.rooms.get( key )!;

        room.addClient( socket );
        
        return room;
    }

}