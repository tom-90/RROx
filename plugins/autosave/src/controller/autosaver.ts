import { Actions, IPluginController, SettingsStore } from "@rrox/api";
import { AutosaveCommunicator, AutosaveSettings, IAutosaveSettings, Log } from "../shared";
import { UGameEngine } from "./structs/Engine/GameEngine";

export class Autosaver {
    private interval?: NodeJS.Timeout;
    private settings: SettingsStore<IAutosaveSettings>;
    private active: boolean = false;

    constructor( private controller: IPluginController ) {
        this.settings = controller.settings.init( AutosaveSettings );

        controller.communicator.handle( AutosaveCommunicator, () => this.autosave() );

        this.settings.addListener( 'update', () => {
            if( this.active )
                this.startAutosave();
        } );
    }

    public start() {
        this.active = true;

        this.startAutosave();
    }

    public stop() {
        this.active = false;
        clearInterval( this.interval! );
        this.interval = undefined;
    }

    private startAutosave() {
        if( !this.settings.get( 'autosave.enabled' ) )
            return;

        clearInterval( this.interval! );
        this.interval = setInterval( async () => {
            if( !this.settings.get( 'autosave.enabled' ) ) {
                clearInterval( this.interval! );
                return;
            }

            this.autosave();
        }, this.settings.get( 'autosave.interval' ) * 1000 );
    }

    private async getGameMode() {
        const data = this.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( UGameEngine );
        if( !ref )
            return;
            
        let instances = await ref.getInstances( 1 );
        if( !instances || instances.length !== 1 )
            return;

        const [ engine ] = instances;

        return ( await data.query(
            await data.prepareQuery( UGameEngine, ( qb ) => [ qb.GameViewport.World.ARRGameMode ] ),
            engine
        ) )?.GameViewport?.World?.ARRGameMode;
    }

    private async autosave() {
        const structAction = this.controller.getAction( Actions.GET_STRUCT );
        const struct = await structAction.getStruct( 'Class arr.arrGameModeBase' );

        if( !struct )
            return;

        if(struct.functions.some((f) => f.cppName === 'AutoSaveGame')) {
            Log.log('Disabling auto-save as this is not supported and can cause crashes on the beta-branch.');
            this.stop();
            return;
        }
        
        const gameMode = await this.getGameMode();

        if( !gameMode )
            return;

        const lastSlot = this.settings.get( 'autosave.lastSlot' );
        const slots = this.settings.get( 'autosave.slots' );

        let slot: string;

        if ( slots.length === 0 )
            return;

        if ( lastSlot == null || !slots.includes( lastSlot ) )
            slot = slots[ 0 ];
        else {
            let index = slots.indexOf( lastSlot ) + 1;
            if ( index >= slots.length )
                index = 0;
            slot = slots[ index ];
        }

        this.settings.set( 'autosave.lastSlot', slot );

        Log.info( 'Saving to slot', slot );

        await gameMode.SaveGame( slot );
    }
}