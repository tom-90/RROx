import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetStaticRequest extends Request {
    public name: string;

    constructor( app: RROxApp, name: string ) {
        super( app, MessageType.GET_STATIC );

        this.name = name;
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.writeString( this.name );
    }
}

export class GetStaticResponse extends Response {
    public name?: string;

    constructor( app: RROxApp, data: BufferIO ) {
        super( app, data );
        
        this.name = data.readString();
    }
}