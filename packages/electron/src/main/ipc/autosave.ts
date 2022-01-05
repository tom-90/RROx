import { IPCListener } from "./ipc";
import { AutosaveTask } from "../tasks";

export class AutosaveIPCListener extends IPCListener {
    public taskName = 'Autosave IPC';
    
    public channel = 'autosave';
    
    protected onMessage(): Promise<void> {
        return this.app.getTask( AutosaveTask ).runNow();
    }
}