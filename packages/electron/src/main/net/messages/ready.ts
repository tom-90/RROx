import { Response } from "../message";

export class ReadyMessage extends Response {
    public process() {
        this.app.emit( 'ready' );
    }
}