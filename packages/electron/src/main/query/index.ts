import { IQuery, QueryBuilder, QueryBuilderFunction, StructConstructor } from '@rrox/api';
import { RROxApp } from '../app';
import { GetDataRequest, GetDataResponse } from '../net';
import { BufferIO } from '../net/io';
import { QueryCommands } from './commands';
import { StructInstance } from './instance';
import { QueryProperty, QueryPropertyResponseHandler } from './property';
import { QueryState } from './state';

export class Query<T extends object> extends IQuery<T> {
    private request?: Buffer;
    private responseHandler?: ( res: BufferIO, base: StructInstance<T> ) => T;
    public static readonly ROOT_STATE_KEY = 'root';

    constructor(
        private app: RROxApp,
        private rootProperty: QueryProperty<any>,
        private builderFn: QueryBuilderFunction<T>
    ) {
        super();
    }

    async prepare() {
        const state = new QueryState( Query.ROOT_STATE_KEY );

        const qbs = this.builderFn( this.rootProperty.build( state ) ).flat();

        qbs.forEach( ( qb, i ) => {
            const state = QueryProperty.getQueryState( qb as QueryBuilder<any> );
            if( !state || !( state instanceof QueryState ) )
                throw new QueryError( `Invalid query property at index ${i}` );

            state.activate();
        } );

        const request = new BufferIO();
        
        const resHandler = this.rootProperty.execute( request, state );

        this.request = request.data();
        this.responseHandler = ( res, base ) => {
            let instance = base.clone();

            resHandler( res, instance );

            return instance.create();
        };
    }

    async query( base: StructInstance<T>, timeout?: number ): Promise<T | null> {
        if( !this.app.isConnected() || !this.request || !this.responseHandler )
            return null;

        const req = new BufferIO();

        const traverser = base.getTraverser();
        const traverseResHandler = traverser.traverse( req );

        req.write( this.request );

        traverser.return( req );

        QueryCommands.finish( req );

        const pipe = this.app.getPipe()!;
        const request = new GetDataRequest( this.app, req );

        await pipe.request( request );

        const res = await pipe.waitForResponse( request, GetDataResponse, timeout );


        if( !traverseResHandler( res.data ) )
            return null;

        return this.responseHandler( res.data, base );
    }
}

export class QueryError extends Error {
    constructor( message: string ) {
        super( message );

        this.name = 'QueryError';
    }
}

export * from './args';
export * from './commands';
export * from './instance';
export * from './property';
export * from './state';
export * from './traverser';