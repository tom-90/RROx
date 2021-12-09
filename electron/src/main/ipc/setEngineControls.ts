import { IPCListener } from "./ipc";
import { SetEngineControlsAction } from "../actions";

export class SetEngineControlsIPCListener extends IPCListener<[ engineIndex: number, regulator: number, reverser: number, brake: number ]> {
    public taskName = 'Set Engine Controls IPC';
    
    public channel = 'set-engine-controls';
    
    protected async onMessage( event: Electron.IpcMainEvent, engineIndex: number, regulator: number, reverser: number, brake: number ): Promise<void> {
        await this.app.getAction( SetEngineControlsAction ).run( engineIndex, regulator, reverser, brake );
    }
}