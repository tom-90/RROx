import { IPluginController, Controller, Actions, IQuery } from '@rrox/api';
import { Log, TeleportCommunicator, ChangeSwitchCommunicator, SetControlsCommunicator, FrameCarControl, GetPlayerCheats, SetPlayerCheats, SetMoneyXPCheats } from '../shared';
import { Cheats } from './cheats';
import { ASwitch } from './structs/arr/Switch';
import { FVector } from './structs/CoreUObject/Vector';
import { World } from './world';

export default class WorldPlugin extends Controller {
    private world: World;
    private cheats: Cheats;

    public async load( controller: IPluginController ): Promise<void> {
        this.world = new World( controller );
        this.cheats = new Cheats( controller );

        controller.addSetup( async () => {
            await this.world.prepare();
            await this.cheats.prepare();

            const interval = setInterval( () => this.world.load(), 1000 );

            this.cheats.start();

            return () => {
                clearInterval( interval );
                this.cheats.stop();
            }
        } );

        controller.communicator.handle( TeleportCommunicator, async ( playerName, location ) => {
            const player = this.world.gameState?.PlayerArray?.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate )
                return Log.warn( `Cannot teleport player '${playerName}' as this player could not be found.` );

            await this.world.teleport( player, location );
        } );

        controller.communicator.handle( ChangeSwitchCommunicator, async ( switchIndex ) => {
            const switchInstance = this.world.gameState?.SwitchArray?.[ switchIndex ];
            
            if( !switchInstance )
                return Log.warn( `Cannot change switch as it could not be found.` );

            await this.world.setSwitch( switchInstance );
        } );

        controller.communicator.handle( SetControlsCommunicator, async ( index, type, value ) => {
            const frameCar = this.world.gameState?.FrameCarArray?.[ index ];
            
            if( !frameCar )
                return Log.warn( `Cannot change controls as the framecar could not be found.` );

            await this.world.setControls( frameCar, type, value );
        } );

        controller.communicator.handle( GetPlayerCheats, ( playerName ) => {
            const player = this.world.gameState?.PlayerArray?.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.getCheats( player );
        } );

        controller.communicator.handle( SetPlayerCheats, ( playerName, cheats ) => {
            const player = this.world.gameState?.PlayerArray?.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.setCheats( player, cheats );
        } );

        controller.communicator.handle( SetMoneyXPCheats, ( playerName, money, xp ) => {
            const player = this.world.gameState?.PlayerArray?.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.setMoneyXP( player, money, xp );
        } );
    }
    
    public unload( controller: IPluginController ): void | Promise<void> {
        throw new Error( 'Method not implemented.' );
    }
}