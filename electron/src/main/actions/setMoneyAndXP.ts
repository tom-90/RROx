import { Action } from "./action";
import { ReadPlayerAddress } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";

export class SetMoneyAndXPAction extends Action<void, [ money: number, xp: number ]> {

    public actionID   = 6;
    public actionName = 'Set Money and XP Action';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( money: number, xp: number ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );
    
        let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
        
        if( playerRead === false ) {
            console.log( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine ) {
            console.log( 'Cannot set player money and xp while driving engines.' );
            return;
        }
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeFloat( money );
        pipe.writeInt( xp );
    }

}
