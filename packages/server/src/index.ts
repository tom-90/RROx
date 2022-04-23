import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import { RoomManager } from './room';
import { instrument } from '@socket.io/admin-ui';
import apiRouter from './api';
import { logger } from './log';

const app = express();
const server = http.createServer( app );
const io = new SocketServer(
    server,
    {
        maxHttpBufferSize: 10000000, // 10MB
        pingInterval     : 25000,
        pingTimeout      : 60000,
        allowUpgrades    : false,
        cors             : {
            origin: [ "https://admin.socket.io" ],
            credentials: true
        }
    }
);

app.use( express.json() );
app.use( logger );

instrument( io, { 
    auth: {
        type    : 'basic',
        username: process.env.SOCKETIO_ADMIN_USERNAME || 'admin',
        password: process.env.SOCKETIO_ADMIN_PASSWORD || '$2a$12$qP4IjY2iFzSsC5sMfIcVduc8rhlwZxzw8.xm9/kGlEq4Z1M50E39C',
    },
} );

app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( express.static( path.dirname( require.resolve( '@socket.io/admin-ui/ui/dist/index.html' ) ) ) );

app.get( "/admin", ( req, res ) => {
    res.sendFile( require.resolve( '@socket.io/admin-ui/ui/dist/index.html' ), err => {
        if ( err ) res.sendStatus( 500 );
    } );
} );

app.use( "/api", apiRouter );

app.get( "/*", ( req, res ) => {
    res.sendFile( path.join( __dirname, "../public/index.html" ), err => {
        if ( err ) res.sendStatus( 500 );
    } );
} );

const rooms = new RoomManager( io );

io.on( 'connection', ( socket ) => {

    const onJoin = ( key: string, ack?: ( type: 'public' | 'private' | false ) => void ) => {
        if( !key )
            return ack && ack( false );

        let res = rooms.join( socket, key );

        if( !res )
            return ack && ack( false );
    
        removeListeners();

        if ( ack )
            ack( res );
    };

    const onCreate = ( ack?: ( keys: { public: string, private: string } ) => void ) => {
        if( !ack )
            return;

        let room = rooms.create( socket );

        removeListeners();

        ack( {
            public : room.getPublicKey(),
            private: room.getPrivateKey(),
        } );
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