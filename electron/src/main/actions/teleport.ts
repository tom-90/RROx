import { Action } from "./action";
import { GameMode, ReadAddressAction, ReadAddressMode, ReadPlayerAddress } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";
import Log from 'electron-log';

export class TeleportAction extends Action<void, [ x: number, y: number, z: number ]> {

    public actionID   = 5;
    public actionName = 'Teleport Player';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number, z: number  ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );
    
        let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
        
        if( playerRead === false ) {
            Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine ) {
            Log.info( 'Cannot teleport player while driving engines.' );
            return;
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
