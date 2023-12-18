import net from 'net';
import Log from 'electron-log';
import { MessageType, Request, Response } from './message';
import { BufferIO } from './io';
import { LogMessage, ReadyMessage, GetStructResponse, GetStructListResponse, GetDataResponse, GetInstancesResponse, GetStaticResponse, GetStructTypeResponse, GetInstancesMultiResponse } from './messages';
import { RROxApp } from '../app';
import EventEmitter from 'events';
import { Mutex } from 'async-mutex';

export declare interface NamedPipe {
    on( event: 'response', listener: ( res: Response ) => void ): this;
}

export class NamedPipe extends EventEmitter implements NamedPipe {
    public open = true;

    private data: Buffer[] = [];
    private messageSize = 0;

    private lock = new Mutex();

    constructor( protected app: RROxApp, public socket: net.Socket ) {
        super();

        socket.once( 'close', () => {
            Log.info( `Pipe closed.` );
            this.open = false;
        } );
    }

    public listen() {
        this.socket.on( 'data', ( data ) => {
            this.data.push( data );
            this.read();
        } );
    }

    private readFromSocket( length: number ) {
        if ( length === 0 )
            return Buffer.allocUnsafe( 0 );
        if( this.data.length === 0 )
            return false;
        let data: Buffer = this.data.shift()!;

        while ( data.length < length && this.data.length > 0 )
            data = Buffer.concat( [ data, this.data.shift()! ] );

        if( data.length < length ) {
            this.data.unshift( data );
            return false;
        } else if( data.length === length ) {
            return data;
        } else {
            let d1 = data.slice( 0, length );
            let d2 = data.slice( length, data.length );

            this.data.unshift( d2 );
            return d1;
        }
    }

    private readSize() {
        const size = this.readFromSocket( 8 );
        if( !size )
            return false;
        const bigint = size.readBigUInt64LE();
        if( bigint < Number.MIN_SAFE_INTEGER || bigint > Number.MAX_SAFE_INTEGER )
            throw new Error( 'Message size is too large.' );
        return Number( bigint );
    }

    private read() {
        if( this.messageSize == 0 ) {
            const size = this.readSize();
            if( !size )
                return;
            this.messageSize = size;
        }

        const message = this.readFromSocket( this.messageSize );
        if( !message )
            return;

        // Log.debug(this.messageSize);
        // Log.debug( message.toString( 'hex' ) );

        const res = this.createResponse( new BufferIO( message ) );

        res.process();

        this.emit( 'response', res );

        this.messageSize = 0;

        // Check for more messages in the buffer
        this.read();
    }

    public async request( req: Request ) {
        if( !this.open )
            throw new Error( 'NamedPipe has been closed' );

        const release = await this.lock.acquire();

        const buffer = new BufferIO();
        req.process( buffer );

        const sizeBuffer = Buffer.allocUnsafe(8);
        sizeBuffer.writeUInt64LE( buffer.size() );

        const success = this.socket.write( Buffer.concat( [
            sizeBuffer,
            buffer.data()
        ] ) );

        if( !success )
            await new Promise<void>( ( resolve ) => this.socket.once( 'drain', () => resolve() ) );

        release();
    }

    public waitForResponse<T extends Response>( req: Request, resType: { new( ...params: any[] ): T }, timeout = 20000 ): Promise<T> {
        return new Promise( ( resolve, reject ) => {
            let timer: NodeJS.Timeout;

            const onResponse = ( res: Response ) => {
                if( res.id !== req.id )
                    return;

                this.removeListener( 'response', onResponse );

                if( timer )
                    clearTimeout( timer );

                if( !( res instanceof resType ) )
                    return reject( new Error( 'Invalid response type.' ) );
            
                resolve( res as T );
            };

            this.on( 'response', onResponse );

            if( timeout > 0 ) {
                timer = setTimeout( () => {
                    this.removeListener( 'response', onResponse );
                    reject( new Error( `Response timed out after ${timeout}ms for request ${resType.name}.` ) );
                }, timeout );
            }
        } );
    }

    private createResponse( data: BufferIO ): Response {
        const type: MessageType | undefined = data.readUInt16();
        data.setOffset( 0 );

        //if( type !== MessageType.LOG )
        //    Log.debug( 'Received response of type', type );

        switch( type ) {
            case MessageType.LOG:
                return new LogMessage( this.app, data );
            case MessageType.GET_STRUCT:
                return new GetStructResponse( this.app, data );
            case MessageType.GET_STRUCT_LIST:
                return new GetStructListResponse( this.app, data );
            case MessageType.GET_DATA:
                return new GetDataResponse( this.app, data );
            case MessageType.GET_INSTANCES:
                return new GetInstancesResponse( this.app, data );
            case MessageType.GET_STATIC:
                return new GetStaticResponse( this.app, data );
            case MessageType.GET_STRUCT_TYPE:
                return new GetStructTypeResponse( this.app, data );
            case MessageType.GET_INSTANCES_MULTI:
                return new GetInstancesMultiResponse( this.app, data );
            case MessageType.READY:
                return new ReadyMessage( this.app, data );
        }

        throw new Error( `Unknown message type: ${type}` );
    }
}