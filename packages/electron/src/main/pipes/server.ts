import net from 'net';
import { EventEmitter } from 'events';
import { NamedPipe } from './pipe';
import Log from 'electron-log';

export declare interface NamedPipeServer {
    on( event: 'connect'   , listener: ( pipe: NamedPipe ) => void ): this;
    on( event: 'disconnect', listener: ( pipe: NamedPipe ) => void ): this;
}

export class NamedPipeServer extends EventEmitter {

    private sockets: net.Socket[] = [];

    constructor( public readonly name: string ) {
        super()
    }

    public server?: net.Server;

    start() {
        if( this.server )
            return;
        this.server = net.createServer( ( socket ) => {
            this.sockets.push( socket );

            let pipe = new NamedPipe( socket );

            pipe.readString( 3 ).then( ( name ) => {
                pipe.name = name;
                Log.info( `[${pipe.name}] Pipe connected.` );
                this.emit( 'connect', pipe );
            } ).catch( ( e ) => Log.error( 'Pipe Server Connect Error', e ) );

            socket.once( 'close', () => {
                this.sockets = this.sockets.filter( ( s ) => s !== socket );
                this.emit( 'disconnect', pipe );
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
            this.server.close( ( err ) => {
                this.server = null;
                if( err )
                    reject( err )
                else
                    resolve()
            } );

            this.sockets.forEach( ( s ) => s.destroy() );
        } );
    }

}