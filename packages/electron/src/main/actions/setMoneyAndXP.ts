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
    
        let addrPlayer = null;

        if( !name ) {
            let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
        
            if( playerRead === false ) {
                Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
                return;
            }

            let [ addr, insideEngine ] = playerRead;

            if( insideEngine ) {
                Log.info( 'Cannot set money and xp for player while driving engines.' );
                return;
            }

            addrPlayer = addr;
        } else {
            let player = this.app.getTask( ReadWorldTask ).world.Players.find( ( p ) => p.Name === name );

            if( !player ) {
                Log.info( `Player with name '${name}' could not be found. Unable to teleport.` );
                return;
            }
            
            let addr = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'Player', player.ID, gameMode, '[$BASE+PlayerState.PawnPrivate]' );
        
            if( addr === false ) {
                Log.info( 'Player address is unavailable. Unable to set money and xp.' );
                return;
            }

            addrPlayer = addr;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeFloat( money ?? 0 );
        pipe.writeInt( xp ?? 0 );
    }

}
