import { Action } from "./action";
import { GameMode, ReadAddressAction, ReadAddressMode, ReadPlayerAddress } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";

export class ChangeSwitchAction extends Action<void, [ index: number ]> {

    public actionID   = 2;
    public actionName = 'Change Switch';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( index: number ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );
    
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

        let addrSwitch = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'Switch', index, gameMode );

        if( addrSwitch === false )
            throw new Error( 'Unable to retrieve the switch address.' );

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrSwitch );
        pipe.writeUInt64( addrPlayer );
    }

}
