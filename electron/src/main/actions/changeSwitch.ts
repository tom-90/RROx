import { Action } from "./action";
import { ReadAddressAction } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";

export class ChangeSwitchAction extends Action<void, [ index: number ]> {

    public actionID   = 2;
    public actionName = 'Change Switch';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( index: number ): Promise<void> {
        if( !( await this.app.getAction( EnsureInGameAction ).run() ) )
            throw new Error( 'Not in game' );
    
        let addr = await this.app.getAction( ReadAddressAction ).run( 'array', 'Switch', index );

        if( addr === false )
            throw new Error( 'Unable to retrieve the switch address.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addr );
    }

}
