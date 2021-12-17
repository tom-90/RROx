import net from 'net';
import { Mutex } from 'async-mutex';
import Log from 'electron-log';

export class NamedPipe {

    private mutex = new Mutex();

    public open = true;

    public name?: string;

    constructor( public socket: net.Socket ) {
        socket.once( 'end', () => {
            Log.info( `[${this.name}] Pipe closed.` );
            this.open = false;
        } );
    }

    public readBuffer( length: number ): Promise<Buffer> {
        if( !this.open )
            return Promise.reject( new Error( 'NamedPipe has been closed' ) );
        if( length === 0 )
            return Promise.resolve( Buffer.allocUnsafe( 0 ) );
        let buffer: Buffer | null = this.socket.read( length );
        if( buffer )
            return Promise.resolve( buffer );

        return new Promise( ( resolve, reject ) => {
            let readableTries = 0;
            let onReadable = () => {
                readableTries++;
                let buffer: Buffer | null = this.socket.read( length );

                if( !buffer && readableTries <= 10 )
                    return; // Wait for more data

                removeListeners();

                if( !buffer )
                    return reject( new Error( `[${this.name}] Not enough data is available` ) );

                resolve( buffer );
            };

            let onEnd = () => {
                removeListeners();

                reject( new Error( 'NamedPipe has been closed' ) );
            };

            let removeListeners = () => {
                this.socket.removeListener( 'end', onEnd );
                this.socket.removeListener( 'readable', onReadable );
                clearTimeout( timeout );
            };

            this.socket.once( 'end', onEnd );
            this.socket.on( 'readable', onReadable );
            let timeout = setTimeout( () => {
                removeListeners();
                reject( new Error( `[${this.name}] Timeout waiting for data` ) );
            }, 10000 );
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