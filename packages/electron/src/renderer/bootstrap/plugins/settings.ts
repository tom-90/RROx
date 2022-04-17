import { applyDiff, RendererCommunicator, SettingsContext, SettingsMode, SettingsStore, SettingsType } from "@rrox/api";
import { LogFunctions } from "electron-log";
import { SettingsCommunicator } from "../../../shared/communicators";
import { ControllerSettingsStore, LocalStorageSettingsStore } from "../settings";

export class SettingsManager implements SettingsContext {
    private settings: { [ plugin: string ]: any } = {};
    private stores: { [ plugin: string ]: { [ key in SettingsMode ]?: SettingsStore<any> } } = {};

    constructor( private communicator: RendererCommunicator, private log: LogFunctions ) {
        communicator.listen( SettingsCommunicator, ( diff ) => {
            this.settings = applyDiff( this.settings, diff );
            this.update();
        } );

        communicator.rpc( SettingsCommunicator ).then( ( settings ) => { 
            this.settings = settings;
            this.update();
        } ).catch( ( e ) => this.log.error( 'Failed to load settings', e ) );
    }

    get<T>( settings: SettingsType<T> ): SettingsStore<T> {
        if( this.stores[ settings.module.name ]?.[ settings.mode ] )
            return this.stores[ settings.module.name ][ settings.mode ] as ControllerSettingsStore<T>;

        let store: SettingsStore<T>;
        
        switch( settings.mode ) {
            case SettingsMode.CONTROLLER: {
                store = new ControllerSettingsStore( this.communicator, settings.module, this.settings[ settings.module.name ] );
                break;
            }
            case SettingsMode.RENDERER: {
                store = new LocalStorageSettingsStore( settings, this.log );
                break;
            }
            default: {
                throw new Error( `Unknown settings mode '${settings.mode}' for '${settings.module.name}'.` );
            }
        }

        this.stores[ settings.module.name ] = {
            [ settings.mode ]: store,
            ...( this.stores[ settings.module.name ] || {} )
        };

        return store;
    }

    private update() {
        for( let [ plugin, store ] of Object.entries( this.stores ) )
            if( store[ SettingsMode.CONTROLLER ] && this.settings[ plugin ] !== store[ SettingsMode.CONTROLLER ]!.get() )
                ( store[ SettingsMode.CONTROLLER ] as ControllerSettingsStore<any> ).updateSettingsObject( this.settings[ plugin ] );
    }

}