import { RROxApp } from "../../app";
import { BufferIO } from "../io";
import { MessageType, Request } from "../message";
import { GetStructResponse } from "./getStruct";

export class GetStructTypeRequest extends Request {
    public name: string;

    constructor( app: RROxApp, name: string ) {
        super( app, MessageType.GET_STRUCT_TYPE );

        this.name = name;
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.writeString( this.name );
    }
}

export class GetStructTypeResponse extends GetStructResponse {}