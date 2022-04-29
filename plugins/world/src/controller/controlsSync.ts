import { Actions, IPluginController } from "@rrox/api";
import WorldPlugin from ".";
import { FrameCarControl, getCoupledFrames, ICheats, isEngine } from "../shared";
import { Aframecar } from "./structs/arr/framecar";
import { ASCharacter } from "./structs/arr/SCharacter";
import { EMovementMode } from "./structs/Engine/EMovementMode";
import { APawn } from "./structs/Engine/Pawn";
import { APlayerState } from "./structs/Engine/PlayerState";

export class ControlsSynchronizer {
    public synchronizedEngines: Aframecar[] = [];

    private interval: NodeJS.Timeout;

    constructor( private plugin: WorldPlugin ) {}

    public start() {
        this.stop();

        const data = this.plugin.controller.getAction( Actions.QUERY );

        setInterval( async () => {
            // We copy the array such that we can make changes to it
            const engines = [ ...this.synchronizedEngines ];
            
            const ignoredFrames: number[] = [];
            
            const world = this.plugin.world.valueProvider.getValue();
            if( !world )
                return;

            for( let engine of engines ) {
                const index = this.plugin.world.data.frameCars.findIndex( ( fc ) => data.equals( fc, engine ) );
                if( index < 0 || ignoredFrames.includes( index ))
                    continue;

                const frame = world.frameCars[ index ];

                const coupledFrames = getCoupledFrames(
                    frame,
                    index,
                    world.frameCars,
                );

                for( const coupled of coupledFrames ) {
                    if( !isEngine( coupled.frame ) || coupled.frame === frame || !coupled.isCoupled )
                        continue;
                    
                    const gameObj = this.plugin.world.data.frameCars[ coupled.index ];

                    if( coupled.frame.syncedControls ) {
                        // Two coupled engines can not have synced controls at the same time.
                        this.removeEngine( gameObj );
    
                        // Ignore the frame, to make sure we are not double overwriting things
                        // Next world read, the synccontrols will be set correctly
                        ignoredFrames.push( coupled.index );
                    }

                    if( frame.controls.regulator === undefined || frame.controls.reverser === undefined )
                        continue;
    
                    const regulator = frame.controls.regulator;
                    const reverser  = coupled.flipped ? frame.controls.reverser * -1 : frame.controls.reverser;
                    const brake     = frame.controls.brake;
    
                    if( coupled.frame.controls.regulator !== undefined && Math.abs( regulator - coupled.frame.controls.regulator ) > 0.005 )
                        await this.plugin.world.setControls( gameObj, FrameCarControl.Regulator, regulator );
                    if( coupled.frame.controls.reverser !== undefined && Math.abs( reverser - coupled.frame.controls.reverser ) > 0.005 )
                        await this.plugin.world.setControls( gameObj, FrameCarControl.Reverser, reverser );
                    if( coupled.frame.controls.brake !== undefined && Math.abs( brake - coupled.frame.controls.brake ) > 0.005 )
                        await this.plugin.world.setControls( gameObj, FrameCarControl.Brake, brake );
                }
            }
        }, 500 );
    }

    public stop() {
        clearInterval( this.interval );
    }

    public addEngine( engine: Aframecar ) {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        if( this.synchronizedEngines.some( ( e ) => data.equals( e, engine ) ) )
            return;
        this.synchronizedEngines.push( engine );
    }

    public removeEngine( engine: Aframecar ) {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        this.synchronizedEngines = this.synchronizedEngines.filter( ( e ) => !data.equals( e, engine ) );
    }
}