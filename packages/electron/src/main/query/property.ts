import { IQueryProperty, QueryBuilder } from "@rrox/api";
import { BufferIO } from "../net/io";
import { StructInstance } from "./instance";
import { QueryState } from "./state";

const QUERY_PROPERTY_SYMBOL = Symbol( 'QueryProperty' );
const QUERY_STATE_SYMBOL = Symbol( 'QueryState' );

export type QueryPropertyResponseHandler = ( response: BufferIO, struct: StructInstance<any> ) => void;

export class QueryProperty<T> extends IQueryProperty {

    public static readonly PROPERTY_SYMBOL = Symbol( 'QueryProperty' );

    private chain: {
        [ key: string ]: {
            callback: ( state: QueryState<T>, ...args: any[] ) => void,
            type: 'property' | 'function'
        }
    } = {}

    constructor(
        private executor: ( request: BufferIO, state: QueryState<T> ) => QueryPropertyResponseHandler
    ) {
        super();
    }

    public addChainProperty( key: string, callback: ( state: QueryState<T> ) => QueryBuilder<any> ) {
        this.chain[ key ] = { callback, type: 'property' };
    }

    public addChainFunction( key: string, callback: ( state: QueryState<T>, ...args: any[] ) => QueryBuilder<any> ) {
        this.chain[ key ] = { callback, type: 'function' };
    }

    public build<O extends object = any>( state: QueryState<T> ): QueryBuilder<O> {
        const chain = {
            [ QUERY_PROPERTY_SYMBOL ]: this,
            [ QUERY_STATE_SYMBOL ]: state,
        };

        const properties: PropertyDescriptorMap = {};

        for( let [ key, property ] of Object.entries( this.chain ) )
            properties[ key ] = {
                get: () => {
                    if( property.type === 'property' )
                        return property.callback( state );
                    else if( property.type === 'function' )
                        return ( ...args: any[] ) => property.callback( state, ...args );
                },
            };
        
        Object.defineProperties( chain, properties );

        return chain as any;
    }

    public execute( request: BufferIO, state: QueryState<T> ): QueryPropertyResponseHandler {
        return this.executor( request, state );
    }

    public static getQueryProperty<T = any>( qb: QueryBuilder<any> ): QueryProperty<T> {
        return ( qb as any )[ QUERY_PROPERTY_SYMBOL ];
    }

    public static getQueryState<T = any>( qb: QueryBuilder<any> ): QueryState<T> {
        return ( qb as any )[ QUERY_STATE_SYMBOL ];
    }
}