import { IPCHandler } from "./ipc";
import { ReadHeightAction } from "../actions";

export class ReadHeightIPCHandler extends IPCHandler<[ x: number, y: number ]> {
    public taskName = 'Read Height IPC';

    public channel = 'read-height';

    protected handle( x: number, y: number ) {
        return this.app.getAction( ReadHeightAction ).run( x, y );
    }
}
