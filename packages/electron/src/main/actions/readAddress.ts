import { Action } from "./action";
import { PipeType } from "../pipes";
import { GameMode } from "./ensureInGame";

export enum ReadAddressMode {
    GLOBAL = 'GLOBAL',
    ARRAY = 'ARRAY',
}

export class ReadAddressAction extends Action<bigint, [
    addressType: ReadAddressMode.ARRAY, arrayName: string, id: number, gameMode: GameMode, offset?: string
] | [
    addressType: ReadAddressMode.GLOBAL, addressName: string
]> {

    public actionID   = 'A';
    public actionName = 'Read Address';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( addressType: ReadAddressMode, addressOrArrayName: string, id?: number, gameMode?: GameMode, offset: string = '$BASE' ): Promise<bigint> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );

        if( addressType === ReadAddressMode.ARRAY ) {
            pipe.writeInt( ReadAddressMode.ARRAY.length );
            pipe.writeString( ReadAddressMode.ARRAY );
            pipe.writeInt( addressOrArrayName.length );
            pipe.writeString( addressOrArrayName );
            pipe.writeInt( id );
            pipe.writeInt( offset.length );
            pipe.writeString( offset );
            pipe.writeInt( gameMode === GameMode.CLIENT ? 1 : 0 );
        } else {
            pipe.writeInt( addressOrArrayName.length );
            pipe.writeString( addressOrArrayName );
        }

        let addr = await pipe.readInt64();

        this.release();

        if( addr === BigInt( 0 ) )
            throw new Error( `Invalid address (${addressType}:${addressOrArrayName},${id},${offset})` );

        return addr;
    }

}