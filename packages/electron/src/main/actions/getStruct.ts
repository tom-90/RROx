import { IGetStructAction, StructInfo } from "@rrox/api";
import { Action } from "./action";
import { GetStructListRequest, GetStructListResponse, GetStructRequest, GetStructResponse, StructResponseType } from "../net";
import { Enum, Function, Struct } from "../struct";
import { GlobalTraverserStep, StructInstance } from "../query";

export class GetStructAction extends Action implements IGetStructAction {

    async getStruct( name: string ): Promise<Struct | null> {
        return this.retrieve( name, Struct, StructResponseType.Struct );
    }

    async getEnum( name: string ): Promise<Enum | null> {
        return this.retrieve( name, Enum, StructResponseType.Enum );
    }

    async getFunction( name: string ): Promise<Function | null> {
        return this.retrieve( name, Function, StructResponseType.Function );
    }

    async getList(): Promise<string[]> {
        if( !this.app.isConnected() )
            return [];

        const pipe = this.app.getPipe()!;
        const req  = new GetStructListRequest( this.app );

        await pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStructListResponse, 60000 );

        return res.list;
    }

    /**
     * Retrieves an empty struct info metadata object.
     * 
     * @param name Name of the struct to retrieve it for.
     */
    getInstance<T extends object = any>( name: string ): StructInstance<T> {
        const struct = new StructInstance<T>( this.app );

        struct.setName( name );

        struct.getTraverser().setSteps( [ new GlobalTraverserStep( name ) ] );

        return struct;
    }

    private async retrieve<T extends Struct | Function | Enum>(
        name: string, type: { new( ...params: any[] ): T }, responseType: StructResponseType
    ): Promise<T | null> {
        if( name === '' )
            return null;

        if( this.app.structs.has( name ) ) {
            const struct = this.app.structs.get( name );
            if( !( struct instanceof type ) )
                return null;
            else
                return struct;
        }

        if( !this.app.isConnected() )
            return null;

        const pipe = this.app.getPipe()!;
        const req  = new GetStructRequest( this.app, name );

        await pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStructResponse );
        
        if( res.structType !== responseType || !res.data )
            return null;

        this.app.structs.insert( res.data );

        return res.data as T;
    }

}