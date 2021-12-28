import { IPCHandler } from "./ipc";
import { AttachTask } from "../tasks";

export class GetSocketStateIPCHandler extends IPCHandler {
    public taskName = 'Get WebSocket State IPC';

    public channel = 'get-socket-state';

    protected handle() {
        return this.app.socket.isActive();
    }
}

export class SetSocketStateIPCHandler extends IPCHandler<[ active: boolean ]> {
    public taskName = 'Set Socket State IPC';

    public channel = 'set-socket-state';

    protected handle( active: boolean ) {
        if( active === this.app.socket.isActive() )
            return active;
        
        if( active )
            return this.app.socket.connect();

        this.app.socket.disconnect();
        return false;
    }
}