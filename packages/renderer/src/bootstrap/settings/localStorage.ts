import { SettingsStore, SettingsType } from "@rrox/api";
import { EventEmitter2 } from "eventemitter2";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema } from 'json-schema-typed';
import semver from "semver";
import { LogFunctions } from "electron-log";

export class LocalStorageSettingsStore<T> extends EventEmitter2 implements SettingsStore<T> {
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

        this.validate( data );
        this.set( data );
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

        const previousVersion: string = this.get( LocalStorageSettingsStore.MIGRATION_KEY as keyof T, '0.0.0' as any ) as any;
        const targetVersion = this.options.module.version;

        const newerVersions = Object.keys( this.options.config.migrations )
            .filter( ( candidateVersion ) => this.shouldPerformMigration( candidateVersion, previousVersion, targetVersion ) );

        let backup = this.get();
        for( const version of newerVersions ) {
            try {
                this.options.config.migrations[ version ]( this );

                this.set( LocalStorageSettingsStore.MIGRATION_KEY as keyof T, version as any );
                backup = this.get();
            } catch( e ) {
                this.set( backup );

                throw new Error(
					`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${e as string}`
				);
            }
        }

        this.set( LocalStorageSettingsStore.MIGRATION_KEY as keyof T, targetVersion as any );
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

        this.settings = {
            ...this.settings,
            ...keyOrValues as Partial<T>,
        };

        for( let key in this.settings )
            if( this.settings[ key ] === undefined && key in this.defaultValues )
                this.settings[ key ] = this.defaultValues[ key ];

        this.setLocalStorage( this.settings );
        this.emit( 'update' );
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

}