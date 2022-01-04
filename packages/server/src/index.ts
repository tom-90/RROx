import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import { RoomManager } from './room';

const app = express();
const server = http.createServer( app );
const io = new SocketServer(
    server,
    {
        maxHttpBufferSize: 10000000, // 10MB
    }
);

app.use( express.static( path.join( __dirname, '../public' ) ) );

app.get( "/*", ( req, res ) => {
    res.sendFile( path.join( __dirname, "../public/index.html" ), err => {
        if ( err ) res.sendStatus( 500 );
    } );
} );

const rooms = new RoomManager( io );

io.on( 'connection', ( socket ) => {

    const onJoin = ( key: string, ack?: ( success: boolean ) => void ) => {
        if( !key )
            return ack && ack( false );

        let res = rooms.join( socket, key );

        if( !res )
            return ack && ack( false );
    
        removeListeners();

        if ( ack )
            ack( true );
    };

    const onCreate = ( ack?: ( key: string ) => void ) => {
        if( !ack )
            return;

        let room = rooms.create( socket );

        removeListeners();

        ack( room.key );
    };

    const removeListeners = () => {
        socket.removeListener( 'join'  , onJoin );
        socket.removeListener( 'create', onCreate );
    }

    socket.on( 'join'  , onJoin   );
    socket.on( 'create', onCreate );
} );

server.listen( 3001, () => {
    console.log( 'Listening on *:3001' );
} );

process.on( 'SIGINT', () => {
    console.info( "Stopping" );
    server.close( ( err ) => {
        if( err ) {
            console.log( err );
            process.exit( 1 );
        } else {
            process.exit( 0 );
        }
    } );
} );