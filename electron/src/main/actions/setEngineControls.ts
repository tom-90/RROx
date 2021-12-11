import { Action } from "./action";
import { EnsureInGameAction, ReadAddressAction, ReadAddressMode } from ".";
import { PipeType } from "../pipes";

export class SetEngineControlsAction extends Action<void, [ id: number, regulator: number, reverser: number, brake: number ]> {

    public actionID   = 3;
    public actionName = 'Set Engine Controls';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( id: number, regulator: number, reverser: number, brake: number ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );

        let addrPlayer = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'LocalPlayerPawn' );
        let addrRegulator = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'FrameCar', id, gameMode, '[$BASE+FrameCar.MyRegulator]' );
        let addrReverser = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'FrameCar', id, gameMode, '[$BASE+FrameCar.MyReverser]' );
        let addrBrake = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'FrameCar', id, gameMode, '[$BASE+FrameCar.MyBrake]' );
        
        if( !addrPlayer || !addrRegulator || !addrReverser || !addrBrake )
            throw new Error( 'Unable to retrieve the engine address.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeUInt64( addrBrake );
        pipe.writeUInt64( addrRegulator );
        pipe.writeUInt64( addrReverser );
        pipe.writeFloat( regulator );
        pipe.writeFloat( reverser );
        pipe.writeFloat( brake );
    }

}