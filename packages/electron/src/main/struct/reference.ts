import { LinkedStructRef, StructRef, StructConstructor } from "@rrox/api";
import { QueryActionError, GetStructAction, QueryAction } from "../actions";
import { RROxApp } from "../app";
import { GetInstancesRequest, GetInstancesResponse, GetStaticRequest, GetStaticResponse } from "../net";
import { GlobalTraverserStep, StructInstance } from "../query";
import { Struct } from "./struct";

export class StructReference<S extends object> implements StructRef<S> {

    constructor( protected app: RROxApp, protected struct?: Struct, protected structName?: string ) {}

    async getInstances<T extends S>( base: StructConstructor<T>, count?: number ): Promise<T[] | null> {
        const name = this.app.getAction( QueryAction ).getStructName( base );

        if( !this.app.isConnected() )
            return null;

        if( !( await this.isA( base ) ) )
            throw new QueryActionError( 'Invalid struct passed to getStatic' );

        const pipe = this.app.getPipe()!;
        const req  = new GetInstancesRequest( this.app, name, count );

        pipe.request( req );
        const res = await pipe.waitForResponse( req, GetInstancesResponse );

        return res.list.map( ( name ) => {
            const instance = new StructInstance( this.app, base );

            instance.getTraverser().setSteps( [ new GlobalTraverserStep( name ) ] );

            return instance.create();
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

        pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStaticResponse );

        if( !res.name )
            return null;

        const instance = new StructInstance( this.app, base );

        instance.getTraverser().setSteps( [ new GlobalTraverserStep( res.name ) ] );

        return instance.create();
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

    getInstances( baseOrCount?: ( StructConstructor<S> ) | number, count?: number ): Promise<S[] | null> {
        let base: ( StructConstructor<S> ) | undefined = undefined;
        if( baseOrCount != null && typeof baseOrCount === 'number' )
            count = baseOrCount;
        else
            base = baseOrCount;

        if( !base )
            base = this.link;
        
        return super.getInstances( base, count );
    }

    getStatic(): Promise<S | null>;
    getStatic( base: StructConstructor<S> ): Promise<S | null>;

    getStatic( base?: StructConstructor<S> ): Promise<S | null> {
        if( !base )
            base = this.link;

        return super.getStatic( base );
    }

}