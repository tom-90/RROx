import { IPCListener } from "./ipc";
import { TeleportAction } from './../actions';

export class TeleportIPCListener extends IPCListener<[ x: number, y: number, z: number, name?: string ]> {
    public taskName = 'Teleport Player IPC';
    
    public channel = 'teleport';
    
    public public = true;
    
    protected async onMessage( x: number, y: number, z: number, name?: string ): Promise<void> {
        if( !this.app.settings.get( 'features.teleport' ) )
            return;
        await this.app.getAction( TeleportAction ).run( x, y, z, name );
    }
}