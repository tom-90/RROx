import { Action } from "./action";
import { PipeType } from "../pipes";

export enum ValueTypes {
    BYTE = 1,
    FLOAT = 2,
}

type Params = [ address: bigint, type: ValueTypes.BYTE, value: number ] |
        [ address: bigint, type: ValueTypes.FLOAT, value: number ]

export class SetAddressValueAction extends Action<void, Params> {

    public actionID   = 'W';
    public actionName = 'Read Address Value';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( address: bigint, type: ValueTypes, value: any ): Promise<void> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );
        pipe.writeUInt64( address );
        pipe.writeInt( type );

        if( type === ValueTypes.BYTE )
            pipe.writeByte( value );
        else if( type === ValueTypes.FLOAT )
            pipe.writeFloat( value );
        else
            throw new Error( 'Unknown value type' );
    }

}