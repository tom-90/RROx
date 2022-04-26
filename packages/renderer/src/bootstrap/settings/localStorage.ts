import { SettingsKey, SettingsPath, SettingsStore, SettingsType } from "@rrox/api";
import { EventEmitter2 } from "eventemitter2";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema } from 'json-schema-typed';
import semver from "semver";
import { LogFunctions } from "electron-log";
import deepmerge from "deepmerge";

export class LocalStorageSettingsStore<T extends object> extends EventEmitter2 implements SettingsStore<T> {
    private defaultValues: { [ key in keyof T ]?: any } = {};
    private validator: ValidateFunction;
    private settings: T;

    private static MIGRATION_KEY = '__internal__.migrations';

    constructor( private options: SettingsType<T>, private logger: LogFunctions ) {
        super();

        const ajv = new Ajv( {
            allErrors: true,
            useDefaults: true
        } );

        addFormats( ajv );

        this.validator = ajv.compile( {
            type      : 'object',
            properties: this.options.config.schema
        } );

        for ( const [ key, value ] of Object.entries<JSONSchema>( this.options.config.schema ) )
            if ( value?.default )
                this.defaultValues[ key as keyof T ] = value.default;

        const data = {
            ...this.defaultValues,
            ...this.getLocalStorage(),
        } as T;

        this.setAll( data );
        this.migrate();

        window.addEventListener( 'storage', ( ev ) => {
            if( ev.key !== this.getSettingsKey() )
                return;

            const data = {
                ...this.defaultValues,
                ...this.getLocalStorage(),
            } as T;
    
            this.validate( data );

            this.settings = data;

            this.emit( 'update' );
        } );
    }

    private getLocalStorage(): Partial<T> {
        try {
            const stored = localStorage.getItem( this.getSettingsKey() );
            if( !stored )
                return {};

            const data = JSON.parse( stored );
            this.validate( data );

            return data;
        } catch( e ) {
            this.logger.warn( `Ignoring invalid config for plugin '${this.options.module.name}'.`, e );

            return {};
        }
    }

    private setLocalStorage( data: T ) {
        localStorage.setItem( this.getSettingsKey(), JSON.stringify( data ) );
    }

    private getSettingsKey() {
        return `settings/${this.options.module.name}`;
    }

    private validate(data: T | unknown): void {
        const valid = this.validator( data );
        if ( valid || !this.validator.errors )
            return;

        const errors = this.validator.errors.map( ( { instancePath, message = '' } ) => `\`${instancePath.slice( 1 )}\` ${message}` );

        throw new Error( 'Config schema violation: ' + errors.join( '; ' ) );
	}

    private migrate() {
        if( !this.options.config.migrations )
            return;

        const previousVersion: string = this.get( [ LocalStorageSettingsStore.MIGRATION_KEY ], '0.0.0' as any ) as any;
        const targetVersion = this.options.module.version;

        const newerVersions = Object.keys( this.options.config.migrations )
            .filter( ( candidateVersion ) => this.shouldPerformMigration( candidateVersion, previousVersion, targetVersion ) );

        let backup = this.getAll();
        for( const version of newerVersions ) {
            try {
                this.options.config.migrations[ version ]( this );

                this.set( [ LocalStorageSettingsStore.MIGRATION_KEY ], version as any );
                backup = this.getAll();
            } catch( e ) {
                this.setAll( backup );

                throw new Error(
					`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${e as string}`
				);
            }
        }

        this.set( [ LocalStorageSettingsStore.MIGRATION_KEY ], targetVersion as any );
    }

    private shouldPerformMigration( migrationVersion: string, previousConfigVersion: string, targetConfigVersion: string ) {
        if( semver.clean( migrationVersion ) ) {
            if( previousConfigVersion !== '0.0.0' && semver.satisfies( previousConfigVersion, migrationVersion ) )
                return false;

            return semver.satisfies( targetConfigVersion, migrationVersion );
        }

        if( semver.lte( migrationVersion, previousConfigVersion ) )
            return false;
        if( semver.gt( migrationVersion, targetConfigVersion ) )
            return false;
        return true;
    }

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

    setAll( values: Partial<T> ) {
        const settings = deepmerge( this.settings, values );
        
        this.validate( settings );

        this.settings = settings;

        for( let key in this.settings )
            if( this.settings[ key ] === undefined && key in this.defaultValues )
                this.settings[ key ] = this.defaultValues[ key ];

        this.setLocalStorage( this.settings );
        this.emit( 'update' );
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
            if( nextIndex >= path.length - 1 )
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
        this.reset( ...( Object.keys( this.settings ) as string[] ) );
    }

}