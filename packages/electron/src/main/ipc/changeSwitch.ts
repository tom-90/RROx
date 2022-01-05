import { IPCListener } from "./ipc";
import { ChangeSwitchAction } from "../actions";

export class ChangeSwitchIPCListener extends IPCListener<[ id: number ]> {
    public taskName = 'Change Switch IPC';
    
    public channel = 'change-switch';

    public public = true;
    
    protected async onMessage( id: number ): Promise<void> {
        await this.app.getAction( ChangeSwitchAction ).run( id );
    }
}