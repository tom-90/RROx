import { Action } from "./action";
import { ReadAddressAction, ReadAddressMode, ReadPlayerAddress } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";
import Log from 'electron-log';
import { ReadWorldTask } from "../tasks";
export class SetMoneyAndXPAction extends Action<void, [ name?: string, money?: number, xp?: number ]> {

    public actionID   = 6;
    public actionName = 'Set Money and XP Action';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( name?: string, money?: number, xp?: number ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );
    

        let playerRead = await this.app.getAction( ReadPlayerAddress ).run( name );
    
        if( playerRead === false ) {
            Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine ) {
            Log.info( 'Cannot set money and xp for player while driving engines.' );
            return;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeFloat( money ?? 0 );
        pipe.writeInt( xp ?? 0 );
    }

}
