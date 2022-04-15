import { RROxApp } from "../app";
import { BufferIO } from "./io";

export enum MessageType {
	UNKNOWN = 0,
	LOG = 1,
	GET_STRUCT = 2,
    GET_STRUCT_LIST = 3,
	READY = 4,
    GET_DATA = 5,
    GET_INSTANCES = 6,
    GET_STATIC = 7,
};

export abstract class Message {
    protected app: RROxApp;

    constructor( app: RROxApp ) {
        this.app = app;
    }

    public id: number = 0;
    public type: MessageType = MessageType.UNKNOWN;
}

export class Request extends Message {
    private static NEXT_ID = 1;

    private static getNextID() {
        if( this.NEXT_ID > 65000 )
            this.NEXT_ID = 1;
        return this.NEXT_ID++;
    }

    constructor( app: RROxApp, type: MessageType ) {
        super( app );

        this.id = Request.getNextID();
        this.type = type;
    }

    public process( data: BufferIO ) {
        data.writeUInt16( this.type );
        data.writeUInt16( this.id );
    }
}

export class Response extends Message {
    constructor( app: RROxApp, data: BufferIO ) {
        super( app );

        this.type = data.readUInt16()!;
        this.id = data.readUInt16()!;
    }

    public process() {}
}