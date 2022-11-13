import { LinkedStructRef, StructRef, StructConstructor, MultiLinkedStructRef } from "@rrox/api";
import { QueryActionError, GetStructAction, QueryAction } from "../actions";
import { RROxApp } from "../app";
import { GetInstancesMultiRequest, GetInstancesMultiResponse, GetInstancesRequest, GetInstancesResponse, GetStaticRequest, GetStaticResponse } from "../net";
import { GlobalTraverserStep, StructInstance } from "../query";
import { Struct } from "./struct";

export class StructReference<S extends object> implements StructRef<S> {

    constructor( protected app: RROxApp, protected struct?: Struct, protected structName?: string ) {}

    async getInstances<T extends S>( base: StructConstructor<T>, count?: number, deep?: boolean ): Promise<T[] | null> {
        const name = this.app.getAction( QueryAction ).getStructName( base );

        if( !this.app.isConnected() )
            return null;

        if( !( await this.isA( base ) ) )
            throw new QueryActionError( 'Invalid struct passed to getStatic' );

        const pipe = this.app.getPipe()!;
        const req  = new GetInstancesRequest( this.app, name, count, deep );

        await pipe.request( req );
        const res = await pipe.waitForResponse( req, GetInstancesResponse );

        return res.list.map( ( name ) => {
            const instance = new StructInstance( this.app, base );

            instance.getTraverser().setSteps( [ new GlobalTraverserStep( name ) ] );

            return instance.create() as T;
        } );
    }

    async getStatic<T extends S>( base: StructConstructor<T> ): Promise<T | null> {
        const name = this.app.getAction( QueryAction ).getStructName( base );

        if( !this.app.isConnected() )
            return null;

        if( !( await this.isA( base ) ) )
            throw new QueryActionError( 'Invalid struct passed to getStatic' );

        const pipe = this.app.getPipe()!;
        const req  = new GetStaticRequest( this.app, name );

        await pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStaticResponse );

        if( !res.name )
            return null;

        const instance = new StructInstance( this.app, base );

        instance.getTraverser().setSteps( [ new GlobalTraverserStep( res.name ) ] );

        return instance.create() as T;
    }

    async isA<T extends S>( base: StructConstructor<T> ): Promise<boolean> {
        const name = this.app.getAction( QueryAction ).getStructName( base );

        const allowedNames: string[] = [];
        let structTmp: Struct | null = await this.getStruct();
        while( structTmp != null ) {
            allowedNames.push( structTmp.fullName );
            structTmp = await structTmp.getSuper();
        }

        return allowedNames.includes( name );
    }
    
    protected async getStruct() {
        if( this.struct )
            return this.struct;
        if( !this.structName )
            return null;

        let struct = await this.app.getAction( GetStructAction ).getStruct( this.structName );

        if( !struct )
            return null;

        this.struct = struct;

        return struct;
    }

}

export class LinkedStructReference<S extends object> extends StructReference<S> implements LinkedStructRef<S> {
    constructor( app: RROxApp, struct: Struct, protected link: StructConstructor<S> ) {
        super( app, struct );
    };

    async getInstances( base: StructConstructor<S>, count?: number ): Promise<S[] | null>;
    async getInstances( count?: number ): Promise<S[] | null>

    getInstances( baseOrCount?: ( StructConstructor<S> ) | number, countOrDeep?: number | boolean, deep?: boolean ): Promise<S[] | null> {
        let base: ( StructConstructor<S> ) | undefined = undefined;
        let count: number;
        if( ( baseOrCount != null && typeof baseOrCount === 'number' ) || ( countOrDeep != null && typeof countOrDeep === 'boolean' ) ) {
            count = baseOrCount as number;
            deep = countOrDeep as boolean;
        } else {
            base = baseOrCount;
            count = countOrDeep as number;
        }

        if( !base )
            base = this.link;
        
        return super.getInstances( base, count, deep );
    }

    getStatic(): Promise<S | null>;
    getStatic( base: StructConstructor<S> ): Promise<S | null>;

    getStatic( base?: StructConstructor<S> ): Promise<S | null> {
        if( !base )
            base = this.link;

        return super.getStatic( base );
    }

    public getName() {
        return this.app.getAction( QueryAction ).getStructName( this.link );
    }

    public getConstructor() {
        return this.link;
    }
}

export class MultiLinkedStructReference<S extends object> implements MultiLinkedStructRef<S> {
    constructor( private app: RROxApp, private subStructs: LinkedStructReference<S>[] ) {
    }

    getStructs(): LinkedStructRef<S>[] {
        return this.subStructs;
    }

    async getInstances( count?: number, deep?: boolean ): Promise<S[] | null> {
        const names = this.subStructs.map((s) => s.getName());

        if( !this.app.isConnected() )
            return null;

        const pipe = this.app.getPipe()!;
        const req  = new GetInstancesMultiRequest( this.app, names, count, deep );

        await pipe.request( req );
        const res = await pipe.waitForResponse( req, GetInstancesMultiResponse );

        return res.list.map( ( { name, index } ) => {
            const base = this.subStructs[ index ];

            const instance = new StructInstance( this.app, base.getConstructor() );

            instance.getTraverser().setSteps( [ new GlobalTraverserStep( name ) ] );

            return instance.create() as S;
        } );
    }
}