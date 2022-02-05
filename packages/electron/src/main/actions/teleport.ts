import { Action } from "./action";
import { ReadPlayerAddress, GameMode, ReadHeightAction } from '.';
import { ReadWorldTask } from '../tasks';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";
import Log from 'electron-log';
import { Geometry, Vector2D } from "../utils";

export class TeleportAction extends Action<void, [ x: number, y: number, z?: number, name?: string ]> {

    public actionID   = 5;
    public actionName = 'Teleport Player';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number, z?: number, name?: string ): Promise<void> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );

        if( gameMode !== GameMode.HOST ) {
            Log.info( 'Cannot teleport because running as client.' );
            return;
        }
    
        let playerRead = await this.app.getAction( ReadPlayerAddress ).run( name );
    
        if( playerRead === false ) {
            Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine ) {
            Log.info( 'Cannot teleport player while driving engines.' );
            return;
        }

        if( z == null ) {
            let height = await this.getHeight( x, y );

            if( !height ) {
                Log.info( 'Cannot determine height.' );
                return;
            }

            z = height;
        }
        
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrPlayer );
        pipe.writeFloat( x );
        pipe.writeFloat( y );
        pipe.writeFloat( z );
    }

    private async getHeight( x: number, y: number ) {
        let height = await this.app.getAction( ReadHeightAction ).run( x, y );

        if( !height )
            return false;

        Geometry.getSplinesNear(
            new Vector2D( [ x, y ] ),
            this.app.getTask( ReadWorldTask ).world.Splines
        ).forEach( ( data ) => data.point.coords[ 2 ] > height ? height = data.point.coords[ 2 ] : null );

        return height + 400;
    }

}
