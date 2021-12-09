import { Action } from "./action";
import { PipeType } from "../pipes";

export class ReadAddressAction extends Action<bigint, [
    addressType: 'array', arrayName: string, index: number,
] | [
    addressType: 'global', addressName: string
]> {

    public actionID   = 'A';
    public actionName = 'Read Address';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( addressType: 'array' | 'global', addressOrArrayName: string, index?: number ): Promise<bigint> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );

        if( addressType === 'array' ) {
            pipe.writeInt( 'ARRAY'.length );
            pipe.writeString( 'ARRAY' );
            pipe.writeInt( addressOrArrayName.length );
            pipe.writeString( addressOrArrayName );
            pipe.writeInt( index );
        } else {
            pipe.writeInt( addressOrArrayName.length );
            pipe.writeString( addressOrArrayName );
        }

        let addr = await pipe.readInt64();

        if( addr === BigInt( 0 ) )
            throw new Error( 'Invalid address' );

        return addr;
    }

}