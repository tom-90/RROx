import { IPCListener, IPCHandler } from "./ipc";
import { AttachTask } from "../tasks";

export class GetAttachedStateIPCHandler extends IPCHandler {
    public taskName = 'Set Attached State IPC';
    
    public channel = 'get-attached-state';
    
    protected handle() {
        return this.app.getTask( AttachTask ).state;
    }
}

export class SetAttachedStateIPCListener extends IPCListener<[ state: 'ATTACH' | 'DETACH' ]> {
    public taskName = 'Set Attached State IPC';
    
    public channel = 'set-attached-state';
    
    protected onMessage( state: 'ATTACH' | 'DETACH' ) {
        let attachTask =  this.app.getTask( AttachTask );

        if( state === 'ATTACH' )
            attachTask.start();
        else if( state === 'DETACH' )
            attachTask.stop();
    }
}