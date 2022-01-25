import { TimerTask } from "./task";
import { ReadWorldTask } from './readWorld';
import { EnsureInGameAction, ReadAddressAction, ReadAddressMode, ReadAddressValueAction, SetAddressValueAction, ValueTypes } from "../actions";

export class CheatsTask extends TimerTask {

    public taskName = "Set Cheat Values";
    public interval = 500;

    protected async execute() {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            return;

        const readWorldTask = this.app.getTask( ReadWorldTask );
        const readAddressAction = this.app.getAction( ReadAddressAction );
        const readAddressValueAction = this.app.getAction( ReadAddressValueAction );
        const setAddressValueAction = this.app.getAction( SetAddressValueAction );
        const world = readWorldTask.world;

        for( const player of world.Players ) {
            if( player.WalkSpeed != null ) {
                let walkSpeedAddr = await readAddressAction.run( ReadAddressMode.ARRAY, 'Player', player.ID, gameMode, '[[$BASE+PlayerState.PawnPrivate]+GPlayer.CharacterMovement]+MovementComponent.MaxWalkSpeed' );

                if( !walkSpeedAddr )
                    continue;

                let walkSpeed = await readAddressValueAction.run( walkSpeedAddr, ValueTypes.FLOAT );

                if( walkSpeed !== 600 )
                    continue;

                await setAddressValueAction.run( walkSpeedAddr, ValueTypes.FLOAT, player.WalkSpeed );
            }

            if( player.FlySpeed != null ) {
                let flySpeedAddr = await readAddressAction.run( ReadAddressMode.ARRAY, 'Player', player.ID, gameMode, '[[$BASE+PlayerState.PawnPrivate]+GPlayer.CharacterMovement]+MovementComponent.MaxFlySpeed' );

                if( !flySpeedAddr )
                    continue;

                await setAddressValueAction.run( flySpeedAddr, ValueTypes.FLOAT, player.FlySpeed );
            }
        }
    }

}