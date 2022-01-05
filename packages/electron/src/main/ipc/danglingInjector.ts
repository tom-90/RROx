import { IPCListener } from "./ipc";
import { AttachTask } from "../tasks";
import { WindowType } from "../windows";

export class KillDanglingInjector extends IPCListener {
    public taskName = 'Kill Dangling Injector IPC';
    
    public channel = 'kill-dangling-injector';
    
    protected onMessage() {
        this.app.getTask( AttachTask ).kill().then( () => {
            this.app.getWindow( WindowType.App ).webContents.send( 'dangling-injector', 'KILLED' );
        } ).catch( () => {
            this.app.getWindow( WindowType.App ).webContents.send( 'dangling-injector', 'ERROR' );
        } );
    }
}