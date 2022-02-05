import { Action } from "./action";
import { PipeType } from "../pipes";

export class ReadObjectName extends Action<string | false, [ address: bigint ]> {

    public actionID   = 'N';
    public actionName = 'Read Object Name';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( address: bigint ): Promise<string | false> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );
        pipe.writeUInt64( address );

        let name = await pipe.readString( await pipe.readInt() );

        this.release();

        if( name === '' )
            return false;

        return name;
    }

}