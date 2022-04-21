import { RendererCommunicator, SettingsStore } from "@rrox/api";
import { EventEmitter2 } from "eventemitter2";
import { SetSettingsCommunicator } from "../../communicators";

export class ControllerSettingsStore<T> extends EventEmitter2 implements SettingsStore<T> {

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
