import { IPCListener } from "./ipc";
import { SetEngineControlsAction } from "../actions";
import { EngineControls } from "../../shared/controls";

export class SetEngineControlsIPCListener extends IPCListener<[ id: number, type: EngineControls, value: number ]> {
    public taskName = 'Set Engine Controls IPC';
    
    public channel = 'set-engine-controls';
    
    protected async onMessage( event: Electron.IpcMainEvent, id: number, type: EngineControls, value: number ): Promise<void> {
        await this.app.getAction( SetEngineControlsAction ).run( id, type, value );
    }
}