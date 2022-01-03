import { Action } from "./action";
import { ReadPlayerAddress, ReadAddressAction, ReadAddressMode, GameMode } from '.';
import { ReadWorldTask } from '../tasks';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";
import Log from 'electron-log';

export class TeleportAction extends Action<void, [ x: number, y: number, z: number, name?: string ]> {

    public actionID   = 5;
    public actionName = 'Teleport Player';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number, z: number, name?: string ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );

        if( gameMode !== GameMode.HOST ) {
            Log.info( 'Cannot teleport because running as client.' );
            return;
        }
    
        let addrPlayer = null;

        if( !name ) {
            let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
        
            if( playerRead === false ) {
                Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
                return;
            }

            let [ addr, insideEngine ] = playerRead;

            if( insideEngine ) {
                Log.info( 'Cannot teleport player while driving engines.' );
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
                Log.info( 'Player address is unavailable. Unable to teleport' );
                return;
            }

            addrPlayer = addr;
        }

        
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeFloat( x );
        pipe.writeFloat( y );
        pipe.writeFloat( z );
    }

}
