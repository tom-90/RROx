import net from 'net';
import { EventEmitter } from 'events';
import { NamedPipe } from './pipe';
import Log from 'electron-log';
import { RROxApp } from '../app';

export class NamedPipeServer {

    private sockets: net.Socket[] = [];

    constructor( protected app: RROxApp, public readonly name: string ) {}

    public server?: net.Server;

    start() {
        if( this.server )
            return;
        this.server = net.createServer( ( socket ) => {
            this.sockets.push( socket );

            let pipe = new NamedPipe( this.app, socket );
            
            Log.info( 'Pipe connected.' );
            this.app.emit( 'connect', pipe );

            // Start listening for data after emitting connect event
            pipe.listen();

            socket.once( 'close', () => {
                this.sockets = this.sockets.filter( ( s ) => s !== socket );
                this.app.emit( 'disconnect', pipe );
            } );
        } );

        this.server.once( 'close', () => {
            Log.info( 'Pipe Server Closed' );
            this.server = undefined;
        } );

        this.server.listen( "\\\\.\\pipe\\" + this.name, () => {
            Log.info( 'Pipe Server Listening' );
        } );
    }

    stop() {
        if( !this.server )
            return Promise.resolve();

        return new Promise<void>( ( resolve, reject ) => {
            this.server!.close( ( err ) => {
                this.server = undefined;
                if( err )
                    reject( err )
                else
                    resolve()
            } );

            this.sockets.forEach( ( s ) => s.destroy() );
        } );
    }

}