import { BufferIO } from "../io";
import { Response } from "../message";
import Log from "electron-log";
import { RROxApp } from "../../app";

export class LogMessage extends Response {
    public message?: string;

    constructor( app: RROxApp, data: BufferIO ) {
        super( app, data );

        this.message = data.readString();
    }

    public process() {
        if( this.message )
            Log.scope( 'PIPE' ).log( this.message );
    }
}