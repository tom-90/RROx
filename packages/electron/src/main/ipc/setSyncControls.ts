import { IPCListener } from "./ipc";
import { ReadWorldTask } from "../tasks";
import { getCoupledFrames, isEngine } from "@rrox/utils";

export class SetSyncControlsIPCListener extends IPCListener<[ id: number, enabled: boolean ]> {
    public taskName = 'Set Sync Engine Controls IPC';
    
    public channel = 'set-sync-controls';
    
    public public = true;
    
    protected async onMessage( id: number, enabled: boolean ): Promise<void> {
        const readWorldTask = this.app.getTask( ReadWorldTask );

        const frame = readWorldTask.world.Frames.find( ( f ) => f.ID === id );

        if( !frame || !isEngine( frame ) )
            return;

        const data = readWorldTask.getStaticData( 'Frames', id );
        
        data.SyncControls = enabled;

        readWorldTask.setStaticData( 'Frames', id, data );

        if( enabled ) {
            // Disable sync controls for all other engines
            const coupledFrames = getCoupledFrames( frame, readWorldTask.world.Frames );
    
            for( const coupled of coupledFrames ) {
                if( !coupled.frame.SyncControls || coupled.frame === frame || !isEngine( coupled.frame ) )
                    continue;
                
                const staticData = readWorldTask.getStaticData( 'Frames', coupled.frame.ID );
                delete staticData.SyncControls;
                readWorldTask.setStaticData( 'Frames', coupled.frame.ID, staticData );
            }
        }
    }
}