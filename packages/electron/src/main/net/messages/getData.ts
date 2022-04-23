import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetDataRequest extends Request {
    constructor( app: RROxApp, public req: BufferIO ) {
        super( app, MessageType.GET_DATA );
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.write( this.req );
    }
}

export class GetDataResponse extends Response {
    constructor( app: RROxApp, public data: BufferIO ) {
        super( app, data );
    }
}