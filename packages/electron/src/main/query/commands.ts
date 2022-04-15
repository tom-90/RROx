import { BufferIO } from "../net/io";

export enum QueryCommandTypes {
    READ_BYTES,
    READ_ARRAY,
    READ_ARRAY_RANGES,
    READ_OBJECT_NAME,
    READ_FNAME,
    READ_FSTRING,
    READ_FTEXT,
    TRAVERSE_GLOBAL,
    TRAVERSE_OBJECT,
    TRAVERSE_ARRAY,
    TRAVERSE_OFFSET,
    FINISH,
    WRITE_BYTES,
    WRITE_ARRAY,
    EXECUTE_FUNCTION,
}

export const QueryCommands = {
    readBytes( buffer: BufferIO, offset: number, length: number ) {
        buffer.writeUInt16( QueryCommandTypes.READ_BYTES );
        buffer.writeUInt32( offset );
        buffer.writeUInt32( length );
    },
    readArray( buffer: BufferIO, offset: number, itemSize: number ) {
        buffer.writeUInt16( QueryCommandTypes.READ_ARRAY );
        buffer.writeUInt32( offset );
        buffer.writeUInt32( itemSize );
    },
    readArrayRanges( buffer: BufferIO, offset: number, itemSize: number, ranges: [ start: number, end: number ][] ) {
        buffer.writeUInt16( QueryCommandTypes.READ_ARRAY_RANGES );
        buffer.writeUInt32( offset );
        buffer.writeUInt32( itemSize );

        buffer.writeArray( ranges, ( data, [ start, end ] ) => {
            data.writeInt32( start );
            data.writeInt32( end );
        } );
    },
    readFName( buffer: BufferIO, offset: number ) {
        buffer.writeUInt16( QueryCommandTypes.READ_FNAME );
        buffer.writeUInt32( offset );
    },
    readFString( buffer: BufferIO, offset: number ) {
        buffer.writeUInt16( QueryCommandTypes.READ_FSTRING );
        buffer.writeUInt32( offset );
    },
    readFText( buffer: BufferIO, offset: number ) {
        buffer.writeUInt16( QueryCommandTypes.READ_FTEXT );
        buffer.writeUInt32( offset );
    },
    finish( buffer: BufferIO ) {
        buffer.writeUInt16( QueryCommandTypes.FINISH );
    },
    readObject( buffer: BufferIO, offset: number, name: string, callback: ( buffer: BufferIO ) => void ) {
        buffer.writeUInt16( QueryCommandTypes.TRAVERSE_OBJECT );
        buffer.writeUInt32( offset );
        buffer.writeString( name );
        buffer.writeUInt16( QueryCommandTypes.READ_OBJECT_NAME );

        callback( buffer );

        buffer.writeUInt16( QueryCommandTypes.FINISH );
    },
    setOffset( buffer: BufferIO, offset: number, callback: ( buffer: BufferIO ) => void ) {
        buffer.writeUInt16( QueryCommandTypes.TRAVERSE_OFFSET );
        buffer.writeUInt32( offset );

        callback( buffer );

        buffer.writeUInt16( QueryCommandTypes.FINISH );
    },
    async setOffsetAsync( buffer: BufferIO, offset: number, callback: ( buffer: BufferIO ) => Promise<void> ) {
        buffer.writeUInt16( QueryCommandTypes.TRAVERSE_OFFSET );
        buffer.writeUInt32( offset );

        await callback( buffer );

        buffer.writeUInt16( QueryCommandTypes.FINISH );
    },
    writeBytes( buffer: BufferIO, offset: number, length: number ) {
        buffer.writeUInt16( QueryCommandTypes.WRITE_BYTES );
        buffer.writeUInt32( offset );
        buffer.writeUInt32( length );
    },
    async writeArray( buffer: BufferIO, offset: number, itemSize: number, length: number, write: ( buffer: BufferIO, index: number ) => void | Promise<void> ) {
        buffer.writeUInt16( QueryCommandTypes.WRITE_ARRAY );
        buffer.writeUInt32( offset );
        buffer.writeUInt32( itemSize );
        buffer.writeUInt32( length );

        for( let i = 0; i < length; i++ ) {
            await write( buffer, i );
            buffer.writeUInt16( QueryCommandTypes.FINISH );
        }
    },
    async executeFunction( buffer: BufferIO, name: string, size: number, write: ( buffer: BufferIO ) => void | Promise<void>, read: ( buffer: BufferIO ) => void | Promise<void> ) {
        buffer.writeUInt16( QueryCommandTypes.EXECUTE_FUNCTION );
        buffer.writeString( name );
        buffer.writeUInt32( size );

        await write( buffer );

        buffer.writeUInt16( QueryCommandTypes.FINISH );

        await read( buffer );

        buffer.writeUInt16( QueryCommandTypes.FINISH );
    },
};