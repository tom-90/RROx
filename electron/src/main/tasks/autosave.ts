import { TimerTask } from "./task";
import { EnsureInGameAction, GameMode, MinizwergUploadAction, SaveAction } from "../actions";
import { RROx } from "../rrox";
import Log from 'electron-log';

export class AutosaveTask extends TimerTask {

    public taskName = "Autosave";
    public interval = 60000;

    constructor( app: RROx ) {
        super( app );

        app.on( 'settingsUpdate', () => this.update() );
    }

    private lastUpload?: Date;

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

        if( this.app.settings.get( 'minizwerg.enabled' ) &&
            ( !this.lastUpload || ( new Date().getTime() - this.lastUpload.getTime() ) > 15 * 60 * 1000 ) ) {
            this.lastUpload = new Date();

            Log.info( 'Uploading to minizwerg.' );

            let result = await this.app.getAction( MinizwergUploadAction ).run( slot );

            if( result === false )
                throw new Error( 'Failed to upload to minizwerg.' );
        }
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