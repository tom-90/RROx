import { Action } from "./action";
import { EnsureInGameAction, GameMode, ReadAddressAction, ReadAddressMode, ReadPlayerAddress } from ".";
import { PipeType } from "../pipes";
import { EngineControls } from "../../shared/controls";

export class SetEngineControlsAction extends Action<void, [ id: number, type: EngineControls, value: number ]> {

    public actionID   = 3;
    public actionName = 'Set Engine Controls';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( id: number, type: EngineControls, value: number ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );

        
        let offset;

        if( type === EngineControls.REGULATOR )
            offset = '[$BASE+FrameCar.MyRegulator]';
        else if( type === EngineControls.REVERSER )
            offset = '[$BASE+FrameCar.MyReverser]';
        else if( type === EngineControls.BRAKE )
            offset = '[$BASE+FrameCar.MyBrake]';
        else if( type === EngineControls.WHISTLE )
            offset = '[$BASE+FrameCar.MyWhistle]';
        else if( type === EngineControls.GENERATOR )
            offset = '[$BASE+FrameCar.Myhandvalvegenerator]';
        else if( type === EngineControls.COMPRESSOR )
            offset = '[$BASE+FrameCar.Myhandvalvecompressor]';

        if( !offset )
            throw new Error( 'Unknown control type.' );
        
        let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
    
        if( playerRead === false ) {
            console.log( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine && gameMode === GameMode.CLIENT ) {
            console.log( 'Cannot change switches as client while driving engines.' );
            return;
        }

        let addrControl = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'FrameCar', id, gameMode, offset );
        let addrFramecar = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'FrameCar', id, gameMode );

        if( !addrControl && ( type === EngineControls.GENERATOR || type === EngineControls.COMPRESSOR ) )
            return; // This engine probably does not have a generator or compressor

        if( !addrPlayer || !addrControl || !addrFramecar )
            throw new Error( 'Unable to retrieve the player or control address.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeInt( type );
        pipe.writeUInt64( addrPlayer );
        pipe.writeUInt64( addrControl );
        pipe.writeUInt64( addrFramecar );
        pipe.writeFloat( value );
    }

}