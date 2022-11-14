import { IQueryAction, IQuery, QueryBuilderFunction, STRUCT_NAME_METADATA, PROPERTY_LIST_METADATA, QueryBuilder, PROPERTY_NAME_METADATA, PROPERTY_TYPE_METADATA, PropertyType, StructConstructor, PROPERTY_ARGS_METADATA } from "@rrox/api";
import 'reflect-metadata';
import { Query, StructInstance, QueryProperty, QueryPropertyArgs, QueryPropertyResponseHandler } from "../query";
import { LinkedStructReference, MultiLinkedStructReference, Property } from "../struct";
import { Action } from "./action";
import { GetStructAction } from "./getStruct";

export class QueryAction extends Action implements IQueryAction {

    async getStructProperties<T extends object>( base: StructConstructor<T> ) {
        const structName = this.getStructName( base );

        const propertyKeys = Reflect.getMetadata( PROPERTY_LIST_METADATA, base.prototype ) as string[] ?? [];

        if( !propertyKeys || !Array.isArray( propertyKeys ) || !propertyKeys.every( ( p ) => typeof p === 'string' ) )
            throw new QueryActionError( 'Class does not contain a valid property list.' );

        const struct = await this.app.getAction( GetStructAction ).getStruct( structName );

        if( !struct )
            throw new QueryActionError( `Unable to find struct '${structName}'.` );

        const properties = await struct.getAllProperties();
        
        const availablePropertyTypes = Object.values( PropertyType );

        const mapped: { [ key: string ]: {
            property: Property,
            args    : any[],
        } } = {};

        for( let key of propertyKeys ) {
            const propertyName = Reflect.getMetadata( PROPERTY_NAME_METADATA, base.prototype, key );
            const propertyType = Reflect.getMetadata( PROPERTY_TYPE_METADATA, base.prototype, key );
            const propertyArgs = Reflect.getMetadata( PROPERTY_ARGS_METADATA, base.prototype, key );

            if( !propertyName || typeof propertyName !== 'string' )
                throw new QueryActionError( `Property '${key}' has an invalid name.` );
            if( propertyType == null || typeof propertyType !== 'number' || !availablePropertyTypes.includes( propertyType ) )
                throw new QueryActionError( `Property '${key}' has an invalid property type.` );
            if( propertyArgs == null || !Array.isArray( propertyArgs ) )
                throw new QueryActionError( `Property '${key}' has invalid arguments.` );

            const property = properties.find( ( property ) => property.name === propertyName );

            if( !property )
                throw new QueryActionError( `Property '${propertyName}' does not exist on struct '${structName}'.` );
            if( property.type !== propertyType )
                throw new QueryActionError( `Property '${propertyName}' has a different type than defined on struct '${structName}' in the game. The game code might have changed.` );

            mapped[ key ] = {
                property,
                args: propertyArgs
            };
        }

        return mapped;
    }

    async createQueryBuilder<T extends object>( base: StructConstructor<T>, queryProperty: QueryProperty<{
        properties: {
            [ key: string ]: QueryProperty<any>
        }
    }> ) {
        const properties = await this.getStructProperties( base );

        const qbs: { [ key: string ]: QueryProperty<any> } = {};

        for( let [ key, { property, args } ] of Object.entries( properties ) ) {
            const qb = await property.createQueryBuilder( new QueryPropertyArgs<any[]>( ...args ) as any );

            qbs[ key ] = qb;

            queryProperty.addChainProperty( key, ( state ) => {
                state.onActivate( () => {
                    if( !state.value )
                        state.value = {
                            properties: {}
                        };
    
                    state.value!.properties[ key ] = qb;
                } );

                return qb.build( state.getSubstate( key ) );
            } );
        }

        return qbs;
    }

    getStructName<T extends object>( base: StructConstructor<T> ): string {
        const structName = Reflect.getMetadata( STRUCT_NAME_METADATA, base ) as string;

        if( !structName || typeof structName !== 'string' )
            throw new QueryActionError( 'Class is not a valid struct.' );

        return structName;
    }

    async prepareQuery<T extends object>( base: StructConstructor<T>, fn: QueryBuilderFunction<T> ): Promise<IQuery<T>> {
        const queryProperty = new QueryProperty<{
            properties: {
                [ key: string ]: QueryProperty<any>
            }
        }>( ( req, state ) => {
            const resHandlers: QueryPropertyResponseHandler[] = [];

            for( let [ key, property ] of Object.entries( state.value?.properties || {} ) ) 
                resHandlers.push( property.execute( req, state.getSubstate( key ) ) );

            return ( res, struct ) => {
                for( let handler of resHandlers )
                    handler( res, struct );
            };
        } );

        await this.createQueryBuilder( base, queryProperty );

        const query = new Query<T>( this.app, queryProperty, fn );

        await query.prepare();

        return query as IQuery<T>;
    }

    async query<T extends object>( query: IQuery<T>, base: T, timeout?: number ): Promise<T | null> {
        if( !( query instanceof Query ) )
            throw new QueryActionError( 'Invalid query object' );

        const instance = StructInstance.get( base );

        if( !instance )
            throw new QueryActionError( 'Invalid base object' );

        return ( query as Query<T> ).query( instance, timeout );
    }

    async getReference<T extends object>( base: StructConstructor<T> ): Promise<LinkedStructReference<T> | null> {
        const structName = this.getStructName( base );
        const struct = await this.app.getAction( GetStructAction ).getStruct( structName );
        
        if( !struct )
            return null;

        return new LinkedStructReference( this.app, struct, base );
    }

    async getMultiReference<T extends object>( baseConstructors: StructConstructor<T>[] ): Promise<MultiLinkedStructReference<T> | null> {
        const structs: LinkedStructReference<T>[] = [];

        for(const base of baseConstructors) {
            const struct = await this.getReference<T>(base);
            if(struct !== null)
                structs.push(struct);
        }

        if(structs.length === 0)
            return null;

        return new MultiLinkedStructReference<T>( this.app, structs );
    }

    async create<T extends object>( base: StructConstructor<T> ): Promise<T> {
        const structName = this.getStructName( base );
        const struct = await this.app.getAction( GetStructAction ).getStruct( structName );

        if( !struct || struct.isClass )
            throw new QueryActionError( `Cannot create struct of type ${base?.name}. Only simple structs, starting with the letter F (e.g. FVector) can be created by RROx.` );

        return new StructInstance( this.app, base ).create() as T;
    }

    save<T extends object>( instance: T ): Promise<void> {
        const struct = StructInstance.get( instance );

        if( !struct )
            throw new QueryActionError( 'Invalid instance' );

        return struct.save();
    }

    cast<T extends object>( instance: object, target: StructConstructor<T> ): Promise<T | null> {
        const struct = StructInstance.get( instance );

        if( !struct )
            throw new QueryActionError( 'Invalid instance' );

        return struct.cast( target );
    }

    getName<T extends object>( instance: T ): string | null {
        const struct = StructInstance.get( instance );

        if( !struct )
            throw new QueryActionError( 'Invalid instance' );

        return struct.getName();
    }

    equals<T extends object>( a: T, b: T ): boolean {
        const aStruct = StructInstance.get( a );
        const bStruct = StructInstance.get( b );

        if( !aStruct || !bStruct )
            throw new QueryActionError( 'Invalid instance' );

        const aName = aStruct.getName();
        const bName = bStruct.getName();

        return aName !== null && bName !== null && aName === bName;
    }
}

export class QueryActionError extends Error {
    constructor( message: string ) {
        super( message );

        this.name = 'QueryActionError';
    }
}