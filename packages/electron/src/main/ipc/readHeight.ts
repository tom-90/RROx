import { ReadHeightAction } from '../actions';
import { IPCHandler } from "./ipc";

export class ReadHeightIPCHandler extends IPCHandler<[ x: number, y: number ]> {
    public taskName = 'Read Height';
    
    public channel = 'read-height';
    
    public public = true;
    
    protected handle( x: number, y: number ) {
        return this.app.getAction( ReadHeightAction ).run( x, y );
    }
}