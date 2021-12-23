import { IPCListener } from "./ipc";
import { TeleportAction } from './../actions';

export class TeleportIPCListener extends IPCListener<[ x: number, y: number, z: number ]> {
    public taskName = 'Teleport Player IPC';
    
    public channel = 'teleport';
    
    protected async onMessage( event: Electron.IpcMainEvent, x: number, y: number, z: number ): Promise<void> {
        await this.app.getAction( TeleportAction ).run( x, y, z );
    }
}