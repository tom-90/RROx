import { Action } from "./action";
import { PipeType } from "../pipes";

export class ReadPlayerAddress extends Action<[ address: bigint, insideEngine: boolean ]> {

    public actionID   = 'P';
    public actionName = 'Read Player Address';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute(): Promise<[ address: bigint, insideEngine: boolean ]> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );

        let addr = await pipe.readInt64();
        let isCached = await pipe.readInt();

        this.release();

        if( addr === BigInt( 0 ) )
            throw new Error( `Invalid player address` );

        return [ addr, Boolean( isCached ) ];
    }

}