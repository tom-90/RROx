import { IPluginController, Controller } from '@rrox/api';
import { Log, TeleportCommunicator, ChangeSwitchCommunicator, SetControlsCommunicator, GetPlayerCheats, SetPlayerCheats, SetMoneyXPCheats, WorldSettings, SetControlsSyncCommunicator, storageUseCrane, PlayerCameraReset  } from '../shared';
import { Cheats } from './cheats';
import { ControlsSynchronizer } from './controlsSync';
import { WorldParser } from './parser';
import { World } from './world';
import { Structs } from './structs/types';

export default class WorldPlugin extends Controller {
    public world: World;
    public cheats: Cheats;
    public controller: IPluginController;
    public controlsSync: ControlsSynchronizer;
    public parser: WorldParser;

    public async load( controller: IPluginController ): Promise<void> {
        this.controller = controller;

        const settings = controller.settings.init( WorldSettings );

        this.parser = new WorldParser( this );
        this.world = new World( this, settings );
        this.cheats = new Cheats( this, settings );
        this.controlsSync = new ControlsSynchronizer( this );

        controller.addSetup( async () => {
            await this.world.prepare();
            await this.cheats.prepare();

            this.world.start();
            this.cheats.start();
            this.controlsSync.start();

            return () => {
                this.world.stop();
                this.cheats.stop();
                this.world.stop();
                this.controlsSync.stop();
            }
        } );

        controller.communicator.handle( TeleportCommunicator, async ( playerName, location ) => {
            const player = this.world.data.players.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate )
                return Log.warn( `Cannot teleport player '${playerName}' as this player could not be found.` );

            await this.world.teleport( player, location );
        } );
		
		controller.communicator.handle( PlayerCameraReset, async ( playerName ) => {
            const player = this.world.data.players.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate )
                return Log.warn( `Cannot reset camera/model player '${playerName}' as this player could not be found.` );

            await this.world.playerCameraReset( player );
        } );

        controller.communicator.handle( ChangeSwitchCommunicator, async ( switchIndex, isSplineTrack = false ) => {
            let switchInstance: Structs.ASwitch | Structs.ASplineTrack | undefined;
            if(isSplineTrack)
                switchInstance = this.world.data.splineTracks[ switchIndex ];
            else
                switchInstance = this.world.data.switches[ switchIndex ];
            
            if( !switchInstance )
                return Log.warn( `Cannot change switch as it could not be found.` );

            await this.world.setSwitch( switchInstance );
        } );

        controller.communicator.handle( SetControlsCommunicator, async ( index, type, value ) => {
            const frameCar = this.world.data.frameCars[ index ];
            
            if( !frameCar )
                return Log.warn( `Cannot change controls as the framecar could not be found.` );

            await this.world.setControls( frameCar, type, value );
        } );

        controller.communicator.handle( GetPlayerCheats, ( playerName ) => {
            const player = this.world.data.players.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.getCheats( player );
        } );

        controller.communicator.handle( SetPlayerCheats, ( playerName, cheats ) => {
            const player = this.world.data.players.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.setCheats( player, cheats );
        } );

        controller.communicator.handle( SetMoneyXPCheats, ( playerName, money, xp ) => {
            const player = this.world.data.players.find( ( player ) => player.PlayerNamePrivate === playerName );

            if( !player || !player.PawnPrivate ) {
                Log.warn( `Cannot get cheats for player '${playerName}' as this player could not be found.` );
                return;
            }

            return this.cheats.setMoneyXP( player, money, xp );
        } );

        controller.communicator.handle( SetControlsSyncCommunicator, ( index, enabled = true ) => {
            const frameCar = this.world.data.frameCars[ index ];
            
            if( !frameCar )
                return Log.warn( `Cannot change controls as the framecar could not be found.` );

            if( enabled )
                this.controlsSync.addEngine( frameCar );
            else
                this.controlsSync.removeEngine( frameCar );
        } );

		controller.communicator.handle( storageUseCrane, async ( industryIndex, storageOutputIndex, craneNumber ) => {
			let industryInstance: Structs.Aindustry | undefined;
            industryInstance = this.world.data.industries[ industryIndex ];
			
			const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
			
            if( !industryInstance )
                return Log.warn( `Cannot use crane as the industry could not be found.` );
			
			if (storageOutputIndex < 0 || storageOutputIndex > 3)
				return Log.warn( `Cannot use crane as the storageIndex is out of bounds.` );
			
			if (craneNumber < 1 || craneNumber > 4)
				return Log.warn( `Cannot use crane as the craneNumber is out of bounds.` );
			
			
			await this.world.useCrane( industryInstance, storageOutputIndex, craneNumber );			
        } );

    }
    
    public unload( controller: IPluginController ): void | Promise<void> {
        this.world.stop();
        this.cheats.stop();
        this.controlsSync.stop();
    }
}