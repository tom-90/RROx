import { IPCListener } from "./ipc";
import { ChangeSwitchAction } from "../actions";

export class ChangeSwitchIPCListener extends IPCListener<[ index: number ]> {
    public taskName = 'Change Switch IPC';
    
    public channel = 'change-switch';
    
    protected async onMessage( event: Electron.IpcMainEvent, index: number ): Promise<void> {
        await this.app.getAction( ChangeSwitchAction ).run( index );
    }
}