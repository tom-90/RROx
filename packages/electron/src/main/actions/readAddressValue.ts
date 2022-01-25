import { Action } from "./action";
import { PipeType } from "../pipes";
import { ValueTypes } from ".";

export class ReadAddressValueAction extends Action<unknown, [ address: string ] | [ address: bigint, type: ValueTypes ]> {

    public actionID   = 'V';
    public actionName = 'Read Address Value';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( address: string | bigint, type?: ValueTypes ): Promise<unknown> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );

        if( typeof address === 'bigint' ) {
            pipe.writeInt( 1 );
            pipe.writeInt( type );
            pipe.writeUInt64( address );

            if( type === ValueTypes.BYTE )
                return pipe.readByte();
            else if( type === ValueTypes.FLOAT )
                return pipe.readFloat();
            else
                throw new Error( 'Unknown value type' );
        } else {
            pipe.writeInt( 2 );
            pipe.writeInt( address.length );
            pipe.writeString( address );
            
            let valLength = await pipe.readInt();
            let value     = await pipe.readString( valLength );

            return value;
        }
    }

}