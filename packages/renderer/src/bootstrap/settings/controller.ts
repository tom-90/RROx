import { RendererCommunicator, SettingsKey, SettingsPath, SettingsStore } from "@rrox/api";
import { EventEmitter2 } from "eventemitter2";
import { SetSettingsCommunicator } from "../../communicators";

export class ControllerSettingsStore<T extends object> extends EventEmitter2 implements SettingsStore<T> {

    constructor( private communicator: RendererCommunicator, private plugin: PluginInfo, private settings: T ) {
        super();
    };

    get( pathOrKey: SettingsKey<T, string> | SettingsPath, defaultValue?: any ): any {
        const path: SettingsPath = Array.isArray( pathOrKey ) ? pathOrKey : ( pathOrKey as SettingsKey<T, string> ).split( '.' );

        const value = path.reduce( ( obj, key ) => {
            if( Array.isArray( obj ) ) {
                if( typeof key === 'number' )
                    return obj[ key ];
                const num = Number( key );
                if( Number.isNaN( num ) || !Number.isInteger( num ) )
                    return undefined;
                else
                    return obj[ num ];
            } else if( typeof key === 'string' && typeof obj === 'object' && obj !== null )
                return obj[ key as keyof typeof obj ];
            return undefined;
        }, this.settings );

        if( value === undefined )
            return defaultValue;
        return value;
    }

    getAll(): T {
       return this.settings;
    }

    set( pathOrKey: SettingsKey<T, string> | SettingsPath, value: any ): void {
        const path: SettingsPath = Array.isArray( pathOrKey ) ? pathOrKey : ( pathOrKey as SettingsKey<T, string> ).split( '.' );

        if( path.length === 0 )
            return this.setAll( value );

        const getNextSub = ( nextIndex: number ) => {
            if( nextIndex >= path.length )
                return value;

            const num = Number( path[ nextIndex ] );
            if( Number.isNaN( num ) || !Number.isInteger( num ) )
                return {};
            else
                return [];
        };

        const settings = getNextSub( 0 );

        path.reduce( ( obj, key, i ) => {
            if( i === path.length - 1 )
                return;

            if( Array.isArray( obj ) )
                return obj[ Number( key ) ] = getNextSub( i + 1 );
            else
                return obj[ key ] = getNextSub( i + 1 );
        }, settings );

        return this.setAll( settings );
    }

    setAll( values: Partial<T> ): void {
        this.communicator.emit( SetSettingsCommunicator, this.plugin.name, values );
    } 

    has( pathOrKey: SettingsKey<T, string> | SettingsPath ): boolean {
        return this.get( pathOrKey ) !== undefined;
    }

    reset( ...pathsOrKeys: ( string | SettingsPath )[] ): void {
        const paths = pathsOrKeys.map( ( pathOrKey ) => Array.isArray( pathOrKey ) ? pathOrKey : ( pathOrKey as string ).split( '.' ) );
        
        if( paths.length === 0 )
            return;
        if( paths[ 0 ].length === 0 )
            return this.clear();

        const getNextSub = ( path: ( string | number )[], nextIndex: number ) => {
            if( nextIndex >= path.length )
                return undefined;

            const num = Number( path[ nextIndex ] );
            if( Number.isNaN( num ) || !Number.isInteger( num ) )
                return {};
            else
                return [];
        };

        const settings = getNextSub( paths[ 0 ], 0 )! as Partial<T>;

        paths.forEach( ( path ) => {
            path.reduce( ( obj, key, i ) => {
                if( i === path.length - 1 )
                    return;
    
                if( Array.isArray( obj ) ) {
                    const num = Number( key );
                    return obj[ num ] = obj[ num ] === undefined ? getNextSub( path, i + 1 ) : obj[ num ];
                } else
                    return obj[ key as keyof typeof obj ] = ( obj[ key as keyof typeof obj ] === undefined ? getNextSub( path, i + 1 ) : obj[ key as keyof typeof obj ] ) as any;
            }, settings );
        } );

        return this.setAll( settings );
    }

    clear() {
        return this.reset( ...( Object.keys( this.settings ) as string[] ) );
    }

    updateSettingsObject( settings: T ) {
        this.settings = settings;
        this.emit( 'update' );
    }

}
