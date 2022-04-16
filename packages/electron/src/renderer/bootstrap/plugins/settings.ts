import { applyDiff, RendererCommunicator, SettingsContext, SettingsStore as ISettingsStore, SettingsType } from "@rrox/api";
import { LogFunctions } from "electron-log";
import { EventEmitter2 } from "eventemitter2";
import { SettingsCommunicator, SetSettingsCommunicator } from "../../../shared/communicators";

export class SettingsManager implements SettingsContext {
    private settings: { [ plugin: string ]: any } = {};
    private stores: { [ plugin: string ]: SettingsStore<any> } = {};

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
        if( this.stores[ settings.module.name ] )
            return this.stores[ settings.module.name ] as SettingsStore<T>;

        const store = new SettingsStore( this.communicator, settings.module, this.settings[ settings.module.name ] );

        this.stores[ settings.module.name ] = store;

        return store as SettingsStore<T>;
    }

    private update() {
        for( let [ plugin, store ] of Object.entries( this.stores ) )
            if( this.settings[ plugin ] !== store.get() )
                store.updateSettingsObject( this.settings[ plugin ] );
    }

}

export class SettingsStore<T> extends EventEmitter2 implements ISettingsStore<T> {

    constructor( private communicator: RendererCommunicator, private plugin: PluginInfo, private settings: T ) {
        super();
    };

    get<K extends keyof T>( key: K ): T[ K ];
    get<K extends keyof T>( key: K, defaultValue?: Required<T[ K ]> ): Required<T[ K ]>;
    get(): T;

    get( key?: keyof T, defaultValue?: any ): any {
        if( key === undefined )
            return this.settings;
        
        const value = this.settings[ key ];

        if( value === undefined )
            return defaultValue;
        return value;
    }

    set<K extends keyof T>( key: K, value: T[ K ] ): void;
    set( values: Partial<T> ): void;

    set( keyOrValues: keyof T | Partial<T>, value?: any ) {
        if( typeof keyOrValues === 'string' || typeof keyOrValues === 'number' )
            return this.set( {
                [ keyOrValues ]: value
            } as Partial<T> );

        this.communicator.emit( SetSettingsCommunicator, this.plugin.name, keyOrValues as Partial<T> );
    }

    has( key: keyof T ): boolean {
        return key in this.settings;
    }

    reset( ...keys: ( keyof T )[] ) {
        const obj: Partial<T> = {};

        for( let key of keys )
            obj[ key ] = undefined;

        return this.set( obj );
    }

    clear() {
        return this.reset( ...( Object.keys( this.settings ) as ( keyof T )[] ) );
    }

    updateSettingsObject( settings: T ) {
        this.settings = settings;
        this.emit( 'update' );
    }

}