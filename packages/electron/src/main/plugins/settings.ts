import { ControllerCommunicator, SettingsManager as ISettingsManager, SettingsStore as ISettingsStore, SettingsType, ValueProvider } from "@rrox/api";
import EventEmitter from "events";
import Store from "electron-store";
import { SetSettingsCommunicator, SettingsCommunicator } from "../../shared/communicators";
import { IPlugin } from "./type";
import Log from "electron-log";

export class SettingsManager implements ISettingsManager {
    private settingsProvider: ValueProvider<{ [ plugin: string ]: any }>;
    private stores: { [ plugin: string ]: SettingsStore<any> } = {};

    constructor( private communicator: ControllerCommunicator ) {
        this.settingsProvider = this.communicator.provideValue( SettingsCommunicator, {} );

        this.communicator.listen( SetSettingsCommunicator, ( plugin, updates ) => {
            if( !this.stores[ plugin ] )
                return Log.warn( `Cannot update settings for plugin '${plugin}' as no settings have been initialized (yet) in the controller.` );

            this.stores[ plugin ].set( updates );
        } );
    }

    init<T>( type: SettingsType<T> ): SettingsStore<T> {
        const store = new SettingsStore<T>(
            type,
            () => this.update( type.module.name )
        );

        this.stores[ type.module.name ] = store;

        this.update( type.module.name );

        return store;
    }

    private update( plugin: string ) {
        const store = this.stores[ plugin ];

        this.settingsProvider.provide( {
            ...this.settingsProvider.getValue()!,
            [ plugin ]: store.get()
        } );
    }

}

export class PluginSettingsManager implements ISettingsManager {
    
    constructor( private root: ISettingsManager, private plugin: IPlugin ) {}

    init<T>( settings: SettingsType<T> ): ISettingsStore<T> {
        if( settings.module.name !== this.plugin.name )
            throw new Error( 'Cannot initialize settings for a settings schema that is not owned by the plugin.' );
        return this.root.init( settings );
    }

}

export class SettingsStore<T> extends EventEmitter implements ISettingsStore<T> {
    private store: Store<T>;

    constructor( config: SettingsType<T>, private onUpdate: () => void ) {
        super();

        this.store = new Store<T>( {
            accessPropertiesByDotNotation: false,
            clearInvalidConfig           : true,
            cwd                          : 'configs',
            name                         : config.module.name.replace( /[/\\?%*:|"<>]/g, '_' ),
            migrations                   : config.config.migrations,
            schema                       : config.config.schema,
        } );
    }

    get<K extends keyof T>( key: K ): T[ K ];
    get<K extends keyof T>( key: K, defaultValue?: Required<T[ K ]> ): Required<T[ K ]>;
    get(): T;

    get( key?: keyof T, defaultValue?: any ): any {
        if( key === undefined )
            return { ...this.store.store };
        
        return this.store.get( key, defaultValue );
    }

    set<K extends keyof T>( key: K, value: T[ K ] ): void;
    set( values: Partial<T> ): void;

    set( keyOrValues: keyof T | Partial<T>, value?: any ) {
        if( typeof keyOrValues === 'string' || typeof keyOrValues === 'number' )
            return this.set( {
                [ keyOrValues ]: value
            } as Partial<T> );

        this.store.set( keyOrValues as Partial<T> );

        this.onUpdate();
    }

    has( key: keyof T ): boolean {
        return this.store.has( key );
    }

    reset( ...keys: ( keyof T )[] ) {
        this.store.reset( ...keys );

        this.onUpdate();
    }

    clear() {
        this.store.clear();

        this.onUpdate();
    }
}