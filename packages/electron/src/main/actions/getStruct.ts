import { IGetStructAction } from "@rrox/api";
import { Action } from "./action";
import { GetStructListRequest, GetStructListResponse, GetStructRequest, GetStructResponse, StructResponseType } from "../net";
import { Enum, Function, Struct } from "../struct";

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

        pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStructListResponse, 60000 );

        return res.list;
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

        pipe.request( req );
        const res = await pipe.waitForResponse( req, GetStructResponse );
        
        if( res.structType !== responseType || !res.data )
            return null;

        this.app.structs.insert( res.data );

        return res.data as T;
    }

}