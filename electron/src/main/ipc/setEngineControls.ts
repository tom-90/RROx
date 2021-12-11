import { IPCListener } from "./ipc";
import { SetEngineControlsAction } from "../actions";

export class SetEngineControlsIPCListener extends IPCListener<[ id: number, regulator: number, reverser: number, brake: number ]> {
    public taskName = 'Set Engine Controls IPC';
    
    public channel = 'set-engine-controls';
    
    protected async onMessage( event: Electron.IpcMainEvent, id: number, regulator: number, reverser: number, brake: number ): Promise<void> {
        await this.app.getAction( SetEngineControlsAction ).run( id, regulator, reverser, brake );
    }
}