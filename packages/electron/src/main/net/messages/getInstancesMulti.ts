import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetInstancesMultiRequest extends Request {
    public names: string[];
    public count: number;
    public deep: boolean;

    constructor( app: RROxApp, names: string[], count: number = 0, deep: boolean = false ) {
        super( app, MessageType.GET_INSTANCES_MULTI );

        this.names = names;
        this.count = count;
        this.deep = deep;
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.writeArray(this.names, (data, name) => data.writeString(name));
        data.writeUInt32( this.count );
        data.writeBool( this.deep );
    }
}

export class GetInstancesMultiResponse extends Response {
    public list: { index: number, name: string }[]

    constructor( app: RROxApp, data: BufferIO ) {
        super( app, data );

        this.list = [];
        
        data.readArray( () => {
            const index = data.readUInt32();
            const str = data.readString();
            if( index !== undefined && str )
                this.list.push( { index, name: str } );
        } );
    }
}