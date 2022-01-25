import { TimerTask } from "./task";
import { ReadWorldTask } from './readWorld';
import Log from 'electron-log';
import { getCoupledFrames, isEngine } from "@rrox/utils";
import { SetEngineControlsAction } from "../actions";
import { EngineControls } from "@rrox/types";

export class ControlsSyncTask extends TimerTask {

    public taskName = "Sync Locomotive Controls";
    public interval = 500;

    protected async execute() {
        const readWorldTask = this.app.getTask( ReadWorldTask );
        const setControlsAction = this.app.getAction( SetEngineControlsAction );
        const world = readWorldTask.world;

        const ignoredFrames: number[] = [];

        for( const frame of world.Frames ) {
            if( !frame.SyncControls || ignoredFrames.includes( frame.ID ) )
                continue;
            
            const coupledFrames = getCoupledFrames( frame, world.Frames );
            for( const coupled of coupledFrames ) {
                if( !isEngine( coupled.frame ) || coupled.frame === frame || !coupled.isCoupled )
                    continue;
                
                if( coupled.frame.SyncControls ) {
                    // Two coupled engines can not have synced controls at the same time.
                    const staticData = readWorldTask.getStaticData( 'Frames', coupled.frame.ID );
                    delete staticData.SyncControls;
                    readWorldTask.setStaticData( 'Frames', coupled.frame.ID, staticData );

                    // Ignore the frame, to make sure we are not double overwriting things
                    // Next world read, the synccontrols will be set correctly
                    ignoredFrames.push( coupled.frame.ID );
                }

                const Regulator = frame.Regulator;
                const Reverser  = coupled.flipped ? frame.Reverser * -1 : frame.Reverser;
                const Brake     = frame.Brake;

                if( Math.abs( Regulator - coupled.frame.Regulator ) > 0.005 )
                    await setControlsAction.run( coupled.frame.ID, EngineControls.REGULATOR, Regulator );
                if( Math.abs( Reverser - coupled.frame.Reverser ) > 0.005 )
                    await setControlsAction.run( coupled.frame.ID, EngineControls.REVERSER, Reverser );
                if( Math.abs( Brake - coupled.frame.Brake ) > 0.005 )
                    await setControlsAction.run( coupled.frame.ID, EngineControls.BRAKE, Brake );
            }
        }
    }

}