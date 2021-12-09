import { Action } from "./action";
import { ReadAddressAction } from ".";
import { PipeType } from "../pipes";

export class SaveAction extends Action<void, [ slot: number ]> {

    public actionID   = 1;
    public actionName = 'Save';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( slot: number ): Promise<void> {
        let addr = await this.app.getAction( ReadAddressAction ).run( 'global', 'GameModeBase' );

        if( addr === false )
            throw new Error( 'Failed to retrieve address for GameModeBase.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( 1 );
        pipe.writeUInt64( addr );
        pipe.writeInt( slot );
    }

}