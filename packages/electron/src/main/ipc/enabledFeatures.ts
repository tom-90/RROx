import { RROx } from "../rrox";
import { IPCHandler } from "./ipc";

export class EnabledFeaturesIPCHandler extends IPCHandler {
    public taskName = 'Enabled Features';
    
    public channel = 'enabled-features';
    
    public public = true;
    
    constructor( app: RROx ) {
        super( app );

        app.on( 'settings-update', () => this.onUpdate() );
    }

    private getFeaturesData() {
        return {
            teleport       : this.app.settings.get( 'features.teleport'        ),
            controlEngines : this.app.settings.get( 'features.controlEngines'  ),
            controlSwitches: this.app.settings.get( 'features.controlSwitches' ),
            build          : this.app.settings.get( 'features.build'           ),
            cheats         : this.app.settings.get( 'features.cheats'          ),
        }
    }

    protected handle() {
        return this.getFeaturesData();
    }

    public onUpdate() {
        this.app.publicBroadcast( 'enabled-features', this.getFeaturesData() );
    }
}