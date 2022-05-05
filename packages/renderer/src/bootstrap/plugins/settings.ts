import { applyDiff, RendererCommunicator, SettingsContext, SettingsMode, SettingsStore, SettingsType, ValueConsumer } from "@rrox/api";
import { LogFunctions } from "electron-log";
import { LocalSettingsCommunicator, SettingsCommunicator } from "../../communicators";
import { ControllerSettingsStore, LocalStorageSettingsStore } from "../settings";

export class SettingsManager implements SettingsContext {
    private settings: ValueConsumer<{ [ plugin: string ]: any }>;
    private localSettings: ValueConsumer<{ [ plugin: string ]: any }>;
    private stores: { [ plugin: string ]: { [ key in SettingsMode ]?: SettingsStore<any> } } = {};

    constructor( private communicator: RendererCommunicator, private log: LogFunctions ) {
        this.settings = new ValueConsumer( communicator, SettingsCommunicator, {} );
        this.localSettings = new ValueConsumer( communicator, LocalSettingsCommunicator, {} );
        
        const onUpdate = () => this.update();

        this.settings.addListener( 'update', onUpdate );
        this.localSettings.addListener( 'update', onUpdate );
    }

    get<T extends object>( settings: SettingsType<T> ): SettingsStore<T> {
        if( this.stores[ settings.module.name ]?.[ settings.mode ] )
            return this.stores[ settings.module.name ][ settings.mode ] as ControllerSettingsStore<T>;

        let store: SettingsStore<T>;
        
        switch( settings.mode ) {
            case SettingsMode.CONTROLLER: {
                store = new ControllerSettingsStore( this.communicator, settings.module, this.settings.getValue()![ settings.module.name ], settings.mode );
                break;
            }
            case SettingsMode.CONTROLLER_LOCAL: {
                store = new ControllerSettingsStore( this.communicator, settings.module, this.localSettings.getValue()![ settings.module.name ], settings.mode );
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
        for( let [ plugin, store ] of Object.entries( this.stores ) ) {
            const settings = this.settings.getValue()!;
            const localSettings = this.localSettings.getValue()!;

            if( store[ SettingsMode.CONTROLLER ] && settings[ plugin ] !== store[ SettingsMode.CONTROLLER ]!.getAll() )
                ( store[ SettingsMode.CONTROLLER ] as ControllerSettingsStore<any> ).updateSettingsObject( settings[ plugin ] );
            if( store[ SettingsMode.CONTROLLER_LOCAL ] && localSettings[ plugin ] !== store[ SettingsMode.CONTROLLER_LOCAL ]!.getAll() )
                ( store[ SettingsMode.CONTROLLER_LOCAL ] as ControllerSettingsStore<any> ).updateSettingsObject( localSettings[ plugin ] );
        }
    }

}