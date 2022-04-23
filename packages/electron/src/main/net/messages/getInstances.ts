import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetInstancesRequest extends Request {
    public name: string;
    public count: number;
    public deep: boolean;

    constructor( app: RROxApp, name: string, count: number = 0, deep: boolean = false ) {
        super( app, MessageType.GET_INSTANCES );

        this.name = name;
        this.count = count;
        this.deep = deep;
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.writeString( this.name );
        data.writeUInt32( this.count );
        data.writeBool( this.deep );
    }
}

export class GetInstancesResponse extends Response {
    public list: string[]

    constructor( app: RROxApp, data: BufferIO ) {
        super( app, data );

        this.list = [];
        
        data.readArray( () => {
            const str = data.readString();
            if( str )
                this.list.push( str );
        } );
    }
}