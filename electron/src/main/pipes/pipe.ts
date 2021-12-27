import net from 'net';
import { Mutex } from 'async-mutex';
import Log from 'electron-log';

export class NamedPipe {

    private mutex = new Mutex();

    private data: Buffer[] = [];
    private callback: () => void;

    public open = true;

    public name?: string;

    constructor( public socket: net.Socket ) {
        socket.once( 'close', () => {
            Log.info( `[${this.name}] Pipe closed.` );
            this.open = false;
            if ( this.callback )
                this.callback();
        } );

        socket.on( 'data', ( data ) => {
            this.data.push( data );
            if( this.callback )
                this.callback();
        } );
    }

    private readFromSocket( length: number ) {
        if ( length === 0 )
            return Buffer.allocUnsafe( 0 );
        if( this.data.length === 0 )
            return false;
        let data: Buffer = this.data.shift();

        while ( data.length < length && this.data.length > 0 )
            data = Buffer.concat( [ data, this.data.shift() ] );

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

    public readBuffer( length: number ): Promise<Buffer> {
        if( !this.open )
            return Promise.reject( new Error( 'NamedPipe has been closed' ) );
        let data = this.readFromSocket( length );

        if( data !== false )
            return Promise.resolve( data );

        return new Promise( ( resolve, reject ) => {
            let onData = () => {
                if( !this.open )
                    return reject( new Error( 'NamedPipe has been closed' ) );

                data = this.readFromSocket( length );

                if( !data )
                    return; // Wait for more data

                clearTimeout( timeout );
                this.callback = null;

                resolve( data );
            };

            let timeout = setTimeout( () => {
                this.callback = null;

                if ( !this.open )
                    reject( new Error( 'Timeout reached while reading data' ) );
            }, 25000 );

            this.callback = onData;
        } );
    }

    public async readString( length: number ) {
        return ( await this.readBuffer( length ) ).toString();
    }

    public async readInt() {
        return ( await this.readBuffer( 4 ) ).readUInt32LE();
    }

    public async readFloat() {
        return ( await this.readBuffer( 4 ) ).readFloatLE();
    }

    public async readByte() {
        return ( await this.readBuffer( 1 ) ).readInt8();
    }

    public async readInt64() {
        return ( await this.readBuffer( 8 ) ).readBigInt64LE();
    }

    public writeBuffer( buffer: Buffer ) {
        if( !this.open )
            throw new Error( 'NamedPipe has been closed' );
        let success = this.socket.write( buffer );
        if( !success )
            throw new Error( 'Failed to write buffer to NamedPipe' );
    }

    public writeString( string: string ) {
        this.writeBuffer( Buffer.from( string ) );
    }

    public writeInt( number: number ) {
        let buffer = Buffer.allocUnsafe(4);
        buffer.writeInt32LE( number );
        this.writeBuffer( buffer );
    }

    public writeUInt64( number: bigint ) {
        let buffer = Buffer.allocUnsafe(8);
        buffer.writeBigUInt64LE( number );
        this.writeBuffer( buffer );
    }

    public async writeFloat( number: number ) {
        let buffer = Buffer.allocUnsafe(4);
        buffer.writeFloatLE( number );
        this.writeBuffer( buffer );
    }

    public async writeByte( number: number ) {
        let buffer = Buffer.allocUnsafe(1);
        buffer.writeInt8( number );
        this.writeBuffer( buffer );
    }

    public close() {
        if( !this.open )
            throw new Error( 'NamedPipe has already been closed' );

        this.socket.end();
    }

    public async acquire() {
        return await this.mutex.acquire();
    }

    public isLocked() {
        return this.mutex.isLocked();
    }

}