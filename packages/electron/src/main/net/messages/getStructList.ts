import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetStructListRequest extends Request {
    constructor( app: RROxApp ) {
        super( app, MessageType.GET_STRUCT_LIST );
    }
}

export class GetStructListResponse extends Response {
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