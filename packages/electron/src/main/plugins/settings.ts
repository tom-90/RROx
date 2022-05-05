import { ControllerCommunicator, SettingsKey, SettingsManager as ISettingsManager, SettingsPath, SettingsStore as ISettingsStore, SettingsType, ValueProvider } from "@rrox/api";
import EventEmitter from "events";
import Store from "electron-store";
import { SetSettingsCommunicator, SettingsCommunicator, LocalSettingsCommunicator, SetLocalSettingsCommunicator } from "../../shared/communicators";
import { IPlugin } from "./type";
import Log from "electron-log";
import deepmerge from "deepmerge";

export class SettingsManager implements ISettingsManager {
    private static readonly LOCAL_SETTINGS_PLUGINS = [
        '@rrox/electron',
    ];

    private localSettingsProvider: ValueProvider<{ [ plugin: string ]: any }>;
    private settingsProvider: ValueProvider<{ [ plugin: string ]: any }>;
    private stores: { [ plugin: string ]: SettingsStore<any> } = {};

    constructor( private communicator: ControllerCommunicator ) {
        this.settingsProvider = this.communicator.provideValue( SettingsCommunicator, {} );
        this.localSettingsProvider = this.communicator.provideValue( LocalSettingsCommunicator, {} );

        this.communicator.listen( SetSettingsCommunicator, ( plugin, updates ) => {
            if( !this.stores[ plugin ] )
                return Log.warn( `Cannot update settings for plugin '${plugin}' as no settings have been initialized (yet) in the controller.` );

            this.stores[ plugin ].setAll( updates );
        } );

        this.communicator.listen( SetLocalSettingsCommunicator, ( plugin, updates ) => {
            if( !SettingsManager.LOCAL_SETTINGS_PLUGINS.includes( plugin ) )
                return Log.warn( `Cannot update local settings for plugin '${plugin}' as it is not in the local settings list.` );
            if( !this.stores[ plugin ] )
                return Log.warn( `Cannot update settings for plugin '${plugin}' as no settings have been initialized (yet) in the controller.` );

            this.stores[ plugin ].setAll( updates );
        } );
    }

    init<T extends object>( type: SettingsType<T> ): ISettingsStore<T> {
        if( this.stores[ type.module.name ] )
            return this.stores[ type.module.name ];
    
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

        let provider: ValueProvider<{ [ plugin: string ]: any }>;

        if( SettingsManager.LOCAL_SETTINGS_PLUGINS.includes( plugin ) )
            provider = this.localSettingsProvider;
        else
            provider = this.settingsProvider;

        provider.provide( {
            ...provider.getValue()!,
            [ plugin ]: store.getAll()
        } );
    }

}

export class PluginSettingsManager implements ISettingsManager {
    
    constructor( private root: ISettingsManager, private plugin: IPlugin ) {}

    init<T extends object>( settings: SettingsType<T> ): ISettingsStore<T> {
        if( settings.module.name !== this.plugin.name )
            throw new Error( 'Cannot initialize settings for a settings schema that is not owned by the plugin.' );
        return this.root.init( settings );
    }

}

export class SettingsStore<T extends object> extends EventEmitter implements ISettingsStore<T> {
    private store: Store<T>;

    constructor( config: SettingsType<T>, private onUpdate: () => void ) {
        super();

        this.store = new Store<T>( {
            clearInvalidConfig: true,
            cwd               : 'configs',
            name              : config.module.name.replace( /[/\\?%*:|"<>]/g, '_' ),
            migrations        : config.config.migrations,
            schema            : config.config.schema,
        } );

        this.store.onDidAnyChange( () => this.emit( 'update' ) );
    }

    get( pathOrKey: SettingsKey<T, string> | SettingsPath, defaultValue?: any ): any {
        const key = Array.isArray( pathOrKey ) ? pathOrKey.join( '.' ) : pathOrKey as string;
        
        return this.store.get( key as keyof T, defaultValue );
    }

    getAll(): T {
       return this.store.store;
    }

    set( pathOrKey: SettingsKey<T, string> | SettingsPath, value: any ): void {
        const key = Array.isArray( pathOrKey ) ? pathOrKey.join( '.' ) : pathOrKey as string;

        this.store.set( key, value );

        this.onUpdate();
    }

    setAll( data: Partial<T> ) {
        this.store.set( deepmerge( this.getAll(), data as Partial<T>, {
            arrayMerge: ( target, source, options ) => {
                const dest = [ ...target ];
                source.forEach( ( item, i ) => {
                    if( item === undefined )
                        return;
                    if( options!.isMergeableObject!( item ) && dest[ i ] !== undefined )
                        dest[ i ] = deepmerge( target[ i ], item, options )
                    else
                        dest[ i ] = item;
                } );
                return dest;
            }
        } ) );

        this.onUpdate();
    }

    has( pathOrKey: SettingsKey<T, string> | SettingsPath ): boolean {
        const key = Array.isArray( pathOrKey ) ? pathOrKey.join( '.' ) : pathOrKey as string;

        return this.store.has( key as keyof T);
    }

    reset( ...pathsOrKeys: ( string | SettingsPath )[] ) {
        const keys = pathsOrKeys.map( ( pathOrKey ) => Array.isArray( pathOrKey ) ? pathOrKey.join( '.' ) : pathOrKey as string );

        this.store.reset( ...keys as ( keyof T )[] );

        this.onUpdate();
    }

    clear() {
        this.store.clear();

        this.onUpdate();
    }
}