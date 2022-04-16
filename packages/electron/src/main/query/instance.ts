import { StructInfo, StructConstructor, PROPERTY_LIST_METADATA, FUNCTION_LIST_METADATA, PROPERTY_NAME_METADATA, FUNCTION_NAME_METADATA, IProperty, FUNCTION_ARGS_METADATA, InOutParam } from "@rrox/api";
import { Query } from ".";
import { QueryAction, GetStructAction } from "../actions";
import { RROxApp } from "../app";
import { GetDataRequest, GetDataResponse } from "../net";
import { BufferIO } from "../net/io";
import { Property } from "../struct";
import { QueryPropertyArgs } from "./args";
import { QueryCommands } from "./commands";
import { QueryProperty, QueryPropertyResponseHandler } from "./property";
import { QueryState } from "./state";
import { FakeTraverserStep, Traverser } from "./traverser";

export class StructInstance<T extends object> implements StructInfo<T> {
    private static instanceMap = new WeakMap<object, StructInstance<any>>();
    private static metadataMap = new WeakMap<StructConstructor<any>, { properties: string[], functions: string[] }>();

    private base?: StructConstructor<T>;
    private properties: string[] = [];
    private functions: string[] = [];
    private instance: T | null = null;
    private name: string | null = null;
    private traverser = new Traverser();
    private data: { [ key: string ]: any } = {};

    constructor( private app: RROxApp, base?: StructConstructor<T> ) {
        this.base = base;

        if( base ) {
            if( StructInstance.metadataMap.has( base ) ) {
                const data = StructInstance.metadataMap.get( base )!;
                this.properties = data.properties;
                this.functions = data.functions;
            } else {
                this.properties = Reflect.getMetadata( PROPERTY_LIST_METADATA, base.prototype ) || [];
                this.functions = Reflect.getMetadata( FUNCTION_LIST_METADATA, base.prototype ) || [];

                StructInstance.metadataMap.set( base, {
                    properties: this.properties,
                    functions : this.functions,
                } );
            }
        }
    }

    /**
     * Retrieves the struct instance connected to the instance, if available.
     * 
     * @param instance
     * @returns 
     */
    public static get<T extends object>( instance: T ): StructInstance<T> | null {
        if( !this.instanceMap.has( instance ) )
            return null;
        return this.instanceMap.get( instance )!;
    }

    /**
     * Create the class instance of the struct
     */
    public create(): T {
        if( this.instance )
            throw new StructInstanceError( 'Cannot call create more than once on a StructInstance' );
        if( !this.base )
            throw new StructInstanceError( 'Cannot create struct instance as no class is available' );

        new this.base( this );

        if( !this.instance )
            throw new StructInstanceError( 'builder.apply was not called while creating struct.' );

        return this.instance;
    }

    /**
     * Function to be called by class constructor
     * @param instance 
     */
    public apply( instance: T ): void {
        if( this.instance ) {
            // Skip if instance already defined (e.g. via super() call)
            if( this.instance === instance )
                return;
            throw new StructInstanceError( 'Cannot call builder.apply on different objects.' );
        } else if( StructInstance.instanceMap.has( instance ) ) {
            throw new StructInstanceError( 'Cannot connect an instance to different struct builders.' );
        }

        this.instance = instance;

        this.defineProperties( instance );
        this.defineFunctions( instance );

        StructInstance.instanceMap.set( instance, this );
    }

    /**
     * Define getters and setters on the instance
     *
     * @param instance 
     */
    private defineProperties( instance: T ): void {
        this.properties.forEach( ( property ) => {
            ( instance as any )[ property ] = this.data[ property ];
        } );
        /*Object.defineProperties(
            instance,
            this.properties.reduce( ( obj, property ) => {
                obj[ property ] = {
                    get: () => {
                        if( property in this.changes )
                            return this.changes[ property ];
                        return this.data[ property ];
                    },
                    set: ( value ) => {
                        this.changes[ property ] = value;
                    },
                    enumerable: true
                };

                return obj;
            }, {} as PropertyDescriptorMap )
        );*/
    }

    /**
     * Define getters and setters on the instance
     *
     * @param instance 
     */
    private defineFunctions( instance: T ): void {
        this.functions.forEach( ( func ) => {
            ( instance as any )[ func ] = ( ...args: any[] ) => this.execute( func, args );
        } );
    }

    /**
     * Retrieve the name of the struct if available
     */
    public getName(): string | null {
        return this.name;
    }

    /**
     * Set the name of the struct
     *
     * @param name Name
     */
    public setName( name: string ) {
        this.name = name;
    }

    /**
     * Get the traverser for this struct instance
     */
    public getTraverser() {
        return this.traverser;
    }

    /**
     * Checks whether this StructInstance has a class instance connected to it
     * @returns Boolean indicating whether an instance exists
     */
    public hasInstance() {
        return this.instance != null;
    }

    /**
     * Returns the instance
     * @returns Instance
     */
    public getInstance() {
        return this.instance;
    }

    /**
     * Returns a fresh copy of this StructInstance
     */
    public clone() {
        const instance = new StructInstance( this.app, this.base );

        instance.traverser.copySteps( this );

        return instance;
    }

    /**
     * Set retrieved data for instance
     * @param key 
     * @param value 
     */
    public setValue( key: string, value: any ) {
        this.data[ key ] = value;
    }

    /**
     * Get retrieved data for instance
     * @param key 
     */
    public getValue( key: string ) {
        return this.data[ key ]
    }

    /**
     * Saves the changes applied on the struct to game memory
     */
    public async save(): Promise<void> {
        if( !this.base )
            throw new StructInstanceError( 'Cannot save struct instance as no class is available' );

        const changes = this.getChanges();
        if( Object.keys( changes ).length === 0 )
            return;
        
        const name = await this.app.getAction( QueryAction ).getStructName( this.base );
        const struct = await this.app.getAction( GetStructAction ).getStruct( name );
    
        if( !struct )
            throw new StructInstanceError( 'Struct could not be found during save.' );

        const buffer = new BufferIO();

        this.traverser.traverse( buffer );

        const properties = await struct.getAllProperties();
        for( let propertyKey in changes ) {
            if( !this.properties.includes( propertyKey ) )
                throw new StructInstanceError( `Property '${propertyKey}' that was changed does not exist on struct '${name}'.` );

            const propertyName = Reflect.getMetadata( PROPERTY_NAME_METADATA, this.base.prototype, propertyKey );

            const property = properties.find( ( property ) => property.name === propertyName );
            const value = changes[ propertyKey ];

            if( !property )
                throw new StructInstanceError( `Property '${propertyName}' that was changed does not exist on struct '${name}'.` );

            await property.saveValue( buffer, value );
        }

        this.traverser.return( buffer );

        QueryCommands.finish( buffer );

        const request = new GetDataRequest( this.app, buffer );

        if( !this.app.isConnected() )
            return;

        const pipe = this.app.getPipe()!;

        pipe.request( request );

        await pipe.waitForResponse( request, GetDataResponse );
    }

    private async execute( key: string, args: any[] ): Promise<any> {
        if( !this.base )
            throw new StructInstanceError( 'Cannot execute function for struct as no class is available' );

        const name = await this.app.getAction( QueryAction ).getStructName( this.base );
        const struct = await this.app.getAction( GetStructAction ).getStruct( name );
    
        if( !struct )
            throw new StructInstanceError( 'Struct could not be found during function call.' );

        if( !this.functions.includes( key ) )
            throw new StructInstanceError( `Function '${key}' that was called does not exist on struct '${name}'.` );

        const funcName = Reflect.getMetadata( FUNCTION_NAME_METADATA, this.base.prototype, key );
        const funcArgs = Reflect.getMetadata( FUNCTION_ARGS_METADATA, this.base.prototype, key );

        if( !funcName || typeof funcName !== 'string' )
            throw new StructInstanceError( `Function '${key}' has an invalid name.` );
        if( funcArgs == null || !Array.isArray( funcArgs ) || !Array.isArray( funcArgs[ 0 ] ) )
            throw new StructInstanceError( `Function '${key}' has invalid decorator arguments.` );

        const paramArgs = funcArgs[ 0 ];

        const functions = await struct.getAllFunctions();
        const func = functions.find( ( func ) => func.fullName === funcName );

        if( !func )
            throw new StructInstanceError( `Function '${key}' that was called does not exist on struct '${name}'.` );

        if( paramArgs.length !== func.params.length )
            throw new StructInstanceError( `Function '${key}' has a different number of decorator arguments compared to parameters.` );

        const buffer = new BufferIO();

        const traverseResHandler = this.traverser.traverse( buffer );
        const resHandlers: QueryPropertyResponseHandler[] = [];

        await QueryCommands.executeFunction(
            buffer,
            funcName,
            func.size,
            async ( buffer ) => {
                let index = 0;
                for( let param of func.params ) {
                    let resHandler: ( ( res: BufferIO ) => void ) | void = undefined;

                    if( !param.isFunctionReturnParameter() && param.isFunctionParameter() ) {
                        // We cannot check for InOutParam using instanceof due to different versions of @rrox/api
                        // Therefore, we check using a special flag
                        if( param.isFunctionOutParameter() && typeof args[ index ] === 'object' && args[ index ] !== null
                                && 'constructor' in args[ index ] && args[ index ].constructor.IN_OUT_PARAM === true
                                && 'in' in args[ index ] ) {
                            resHandler = await param.saveValue( buffer, args[ index ].in );
                        } else {
                            resHandler = await param.saveValue( buffer, args[ index ] );
                        }
                        index++;
                    } else if( param.isFunctionReturnParameter() ) {
                        // Make sure the buffer is initialized with sane default values
                        resHandler = await param.saveValue( buffer, null );
                    }

                    if( resHandler )
                        resHandlers.push( resHandler );
                }
            },
            async ( buffer ) => {
                let index = 0;
                for( let param of func.params ) {
                    if( !param.isFunctionParameter() && !param.isFunctionReturnParameter() )
                        continue;

                    if( param.isFunctionReturnParameter() || param.isFunctionOutParameter() ) {
                        const state = new QueryState( param.name );
                        const qb = await param.createQueryBuilder( new QueryPropertyArgs( ...paramArgs[ index ] ) );
                        qb.build( state );
                        resHandlers.push( qb.execute( buffer, state ) );
                    }

                    index++;
                }
            }
        );

        this.traverser.return( buffer );
        QueryCommands.finish( buffer );

        const request = new GetDataRequest( this.app, buffer );

        if( !this.app.isConnected() )
            return;

        const pipe = this.app.getPipe()!;

        pipe.request( request );

        const res = await pipe.waitForResponse( request, GetDataResponse );

        if( !traverseResHandler( res.data ) )
            return null;

        if( res.data.readBool() ) {
            const instance = new StructInstance( this.app );
    
            instance.getTraverser().setSteps( [ new FakeTraverserStep() ] );

            for( let handler of resHandlers )
                handler( res.data, instance );

            let returnValue = null;

            let index = 0;
            for( let param of func.params ) {
                if( !param.isFunctionReturnParameter() && param.isFunctionParameter() ) {
                    if( param.isFunctionOutParameter() && typeof args[ index ] === 'object' && args[ index ] !== null
                            && 'constructor' in args[ index ] && args[ index ].constructor.IN_OUT_PARAM === true
                            && 'in' in args[ index ] ) {
                        ( args[ index ] as InOutParam<any> ).out = instance.getValue( param.name );
                    }
                    index++;
                } else if( param.isFunctionReturnParameter() ) {
                    returnValue = instance.getValue( param.name );
                }
            }

            return returnValue;
        }
    }

    private getChanges() {
        const changes: { [ key: string ]: any } = {};
        
        this.properties.forEach( ( property ) => {
            if( property in this.data && ( this.instance as any )[ property ] !== this.data[ property ] )
                changes[ property ] = ( this.instance as any )[ property ];
        } );

        return changes;
    }
}

export class StructInstanceError extends Error {
    constructor( message: string ) {
        super( message );

        this.name = 'StructInstanceError';
    }
}