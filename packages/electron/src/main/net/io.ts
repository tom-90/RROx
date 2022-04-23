// Defines additional methods on buffer like writeUInt64LE
import 'ref-napi';

export class BufferIO {
    private position: number = 0;
    private writeCache: Buffer[] = [];
    private buffer: Buffer;

    constructor( buffer?: Buffer ) {
        if( buffer )
            this.buffer = buffer;
        else
            this.buffer = Buffer.allocUnsafe( 0 );
    }

    private flush() {
        if( this.writeCache.length == 0 )
            return;
        this.buffer = Buffer.concat( [ this.buffer, ...this.writeCache ] );
        this.writeCache = [];
    }

    public bigintToInt( number: bigint ) {
        if( number < Number.MIN_SAFE_INTEGER || number > Number.MAX_SAFE_INTEGER )
            throw new Error( 'Integer is too large.' );
        return Number( number );
    }

    public hasNext( size: number ) {
        const hasNext = this.position + size <= this.buffer.length;

        if( !hasNext ) {
            this.flush();
            return this.position + size <= this.buffer.length;
        }

        return hasNext;
    }

    public read( size: number ) {
        if( !this.hasNext( size ) )
            return null;
        const data = this.buffer.slice( this.position, this.position + size );

        this.position += size;

        return data;
    }

    public write( data: Buffer | BufferIO ) {
        if( data instanceof BufferIO )
            this.writeCache.push( data.data() )
        else
            this.writeCache.push( data );
    }

    public getOffset() {
        return this.position;
    }

    public setOffset( offset: number ) {
        if( offset >= this.buffer.length ) {
            this.flush();
            if( offset >= this.buffer.length )
                return false;
        }

        this.position = offset;
        return true;
    }

    public data() {
        this.flush();
        return this.buffer;
    }

    public size() {
        this.flush();
        return this.buffer.length;
    }

    public readString() {
        const lengthBigInt = this.readUInt64();
        if( lengthBigInt == null )
            return;
        const length = this.bigintToInt( lengthBigInt );
        return this.read( length )?.toString();
    }

    public readInt8() {
        return this.read( 1 )?.readInt8();
    }

    public readUInt8() {
        return this.read( 1 )?.readUInt8();
    }

    public readInt16() {
        return this.read( 2 )?.readInt16LE();
    }

    public readUInt16() {
        return this.read( 2 )?.readUInt16LE();
    }

    public readInt32() {
        return this.read( 4 )?.readInt32LE();
    }

    public readUInt32() {
        return this.read( 4 )?.readUInt32LE();
    }

    public readInt64() {
        return this.read( 8 )?.readBigInt64LE();
    }

    public readUInt64() {
        return this.read( 8 )?.readBigUInt64LE();
    }

    public readFloat() {
        return this.read( 4 )?.readFloatLE();
    }

    public readDouble() {
        return this.read( 8 )?.readDoubleLE();
    }

    public readBool() {
        return Boolean( this.readUInt8() );
    }

    public readArray<T>( callback: ( data: this, index: number, length: number ) => T ): T[] | undefined {
        const sizeBigInt = this.readUInt64();

        if( sizeBigInt === undefined )
            return;

        const size = this.bigintToInt( sizeBigInt );

        const array: T[] = [];

        for( let i = 0; i < size; i++ )
            array.push( callback( this, i, size ) );

        return array;
    }

    public writeString( string: string ) {
        this.writeUInt64( string.length )
        this.write( Buffer.from( string ) );
    }

    public writeInt8( number: number ) {
        let buffer = Buffer.allocUnsafe(1);
        buffer.writeInt8( number );
        this.write( buffer );
    }

    public writeUInt8( number: number ) {
        let buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8( number );
        this.write( buffer );
    }

    public writeInt16( number: number ) {
        let buffer = Buffer.allocUnsafe(2);
        buffer.writeInt16LE( number );
        this.write( buffer );
    }

    public writeUInt16( number: number ) {
        let buffer = Buffer.allocUnsafe(2);
        buffer.writeUInt16LE( number );
        this.write( buffer );
    }

    public writeInt32( number: number ) {
        let buffer = Buffer.allocUnsafe(4);
        buffer.writeInt32LE( number );
        this.write( buffer );
    }

    public writeUInt32( number: number ) {
        let buffer = Buffer.allocUnsafe(4);
        buffer.writeUInt32LE( number );
        this.write( buffer );
    }

    public writeInt64( number: bigint | number ) {
        let buffer = Buffer.allocUnsafe(8);

        if( typeof number === 'bigint' )
            buffer.writeBigInt64LE( number );
        else
            buffer.writeInt64LE( number );
        
        this.write( buffer );
    }

    public writeUInt64( number: bigint | number ) {
        let buffer = Buffer.allocUnsafe(8);

        if( typeof number === 'bigint' )
            buffer.writeBigUInt64LE( number );
        else
            buffer.writeUInt64LE( number );
        
        this.write( buffer );
    }

    public async writeFloat( number: number ) {
        let buffer = Buffer.allocUnsafe(4);
        buffer.writeFloatLE( number );
        this.write( buffer );
    }

    public async writeDouble( number: number ) {
        let buffer = Buffer.allocUnsafe(8);
        buffer.writeDoubleLE( number );
        this.write( buffer );
    }

    public async writeByte( number: number ) {
        let buffer = Buffer.allocUnsafe(1);
        buffer.writeInt8( number );
        this.write( buffer );
    }

    public writeBool( value: boolean ) {
        let buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8( Number( value ) );
        this.write( buffer );
    }

    public writeNull( size: number = 1 ) {
        for( let i = 0; i < size; i++ )
            this.writeUInt8( 0 );
    }

    public writeArray<T>( array: T[], callback: ( data: this, item: T, index: number, length: number ) => void ) {
        this.writeUInt64( array.length );

        array.forEach( ( item, index ) => callback( this, item, index, array.length ) );
    }
}