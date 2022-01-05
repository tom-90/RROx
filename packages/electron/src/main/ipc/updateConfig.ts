import { IPCListener } from "./ipc";
import { ChangeSwitchAction } from "../actions";

export class UpdateConfigIPCListener extends IPCListener {
    public taskName = 'Update Config IPC';
    
    public channel = 'update-config';
    
    protected onMessage(): void {
        this.app.emit( 'settings-update' );
        this.app.broadcast( 'settings-update' );
    }
}