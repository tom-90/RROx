import { Action } from "./action";
import { EnsureInGameAction, ReadAddressAction } from ".";
import { PipeType } from "../pipes";

export class SetEngineControlsAction extends Action<void, [ index: number, regulator: number, reverser: number, brake: number ]> {

    public actionID   = 3;
    public actionName = 'Set Engine Controls';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( index: number, regulator: number, reverser: number, brake: number ): Promise<void> {
        if( !( await this.app.getAction( EnsureInGameAction ).run() ) )
            throw new Error( 'Not in game' );

        let addr = await this.app.getAction( ReadAddressAction ).run( 'array', 'FrameCar', index );
        
        if( addr === false )
            throw new Error( 'Unable to retrieve the engine address.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addr );
        pipe.writeFloat( regulator );
        pipe.writeFloat( reverser );
        pipe.writeFloat( brake );
    }

}