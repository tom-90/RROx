import { IPCListener } from "./ipc";
import { ReadWorldTask } from "../tasks";
import { EnsureInGameAction, GameMode, ReadAddressAction, ReadAddressMode, SetAddressValueAction, ValueTypes } from "../actions";
import Log from 'electron-log';

export class SetCheatsIPCListener extends IPCListener<[ name?: string, walkSpeed?: number, flySpeed?: number ]> {
    public taskName = 'Set Player Cheats IPC';
    
    public channel = 'set-cheats';
    
    public public = true;
    
    protected async onMessage( name?: string, walkSpeed?: number, flySpeed?: number ): Promise<void> {
        const readWorldTask = this.app.getTask( ReadWorldTask );

        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );

        if( gameMode !== GameMode.HOST ) {
            Log.info( 'Cannot teleport because running as client.' );
            return;
        }

        let id = name ? readWorldTask.world.Players.find( ( p ) => p.Name === name ).ID : 0;

        if( id == null || this.app.getTask( ReadWorldTask ).world.Players.length == 0 ) {
            Log.info( 'Player to set cheats for cannot be found' );
            return;
        }
        
        let movementModeAddr = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'Player', id, gameMode, '[[$BASE+PlayerState.PawnPrivate]+GPlayer.CharacterMovement]+MovementComponent.MovementMode' );

        if( movementModeAddr )
            await this.app.getAction( SetAddressValueAction ).run( movementModeAddr, ValueTypes.BYTE, flySpeed != null ? 5 : 1 );

        const data = readWorldTask.getStaticData( 'Players', id );

        if( walkSpeed != null )
            data.WalkSpeed = walkSpeed;
        else
            delete data.WalkSpeed;

        if( flySpeed != null )
            data.FlySpeed = flySpeed;
        else
            delete data.FlySpeed;

        readWorldTask.setStaticData( 'Players', id, data );
    }
}