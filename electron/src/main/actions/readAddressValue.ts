import { Action } from "./action";
import { PipeType } from "../pipes";

export class ReadAddressValueAction extends Action<string, [ addressName: string ]> {

    public actionID   = 'V';
    public actionName = 'Read Address Value';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( addressName: string ): Promise<string> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );
        pipe.writeInt( addressName.length );
        pipe.writeString( addressName );

        let valLength = await pipe.readInt();
        let value     = await pipe.readString( valLength );

        return value;
    }

}