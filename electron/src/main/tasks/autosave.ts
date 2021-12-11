import { TimerTask } from "./task";
import { EnsureInGameAction, GameMode, SaveAction } from "../actions";
import { RROx } from "../rrox";
import Log from 'electron-log';

export class AutosaveTask extends TimerTask {

    public taskName = "Autosave";
    public interval = 60000;

    constructor( app: RROx ) {
        super( app );

        app.on( 'settingsUpdate', () => this.update() );
    }

    protected async execute(): Promise<void> {
        if ( ( await this.app.getAction( EnsureInGameAction ).run() ) !== GameMode.HOST )
            return;

        let lastSlot = this.app.settings.get( 'autosave.lastSlot' );
        let slots = this.app.settings.get( 'autosave.slots' );

        let slot: number;

        if( slots.length === 0 )
            return;

        if( lastSlot == null || !slots.includes( lastSlot ) )
            slot = slots[ 0 ];
        else {
            let index = slots.indexOf( lastSlot ) + 1;
            if( index >= slots.length )
                index = 0;
            slot = slots[ index ];
        }
        
        this.app.settings.set( 'autosave.lastSlot', slot );

        Log.info( 'Saving to slot', slot );
        
        let result = await this.app.getAction( SaveAction ).run( slot );

        if( result === false )
            throw new Error( 'Failed to autosave.' );

    }

    private update() {
        if( !this.app.settings.get( 'autosave.enabled' ) ) {
            this.stop();
            return;
        }

        let interval = this.app.settings.get( 'autosave.interval' ) * 1000;

        if( interval !== this.interval )
            this.setInterval( interval );

        this.start();
    }

}