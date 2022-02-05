import { Action } from "./action";
import { PipeType } from "../pipes";
import { ReadWorldTask } from "../tasks";
import { EnsureInGameAction, ReadAddressAction, ReadAddressMode, ReadObjectName } from ".";

export class ReadPlayerAddress extends Action<[ address: bigint, insideEngine: boolean ], [ name?: string ]> {

    public actionID   = 'P';
    public actionName = 'Read Player Address';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute( name?: string ): Promise<[ address: bigint, insideEngine: boolean ]> {
        let addr: bigint, insideEngine: boolean;

        if( !name ) {
            await this.acquire();

            let pipe = this.app.getPipe( PipeType.CheatEngineData );

            pipe.writeString( this.actionID );
    
            addr = await pipe.readInt64();
            insideEngine = Boolean( await pipe.readInt() );

            this.release();
        } else {
            let gameMode = await this.app.getAction( EnsureInGameAction ).run();
            if( !gameMode )
                throw new Error( 'Not in game' );

            let player = this.app.getTask( ReadWorldTask ).world.Players.find( ( p ) => p.Name === name );

            if( !player )
                throw new Error( `Player with name '${name}' could not be found.` );
            
            let addrPlayer = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'Player', player.ID, gameMode, '[$BASE+PlayerState.PawnPrivate]' );

            if( addrPlayer ) {
                addr = addrPlayer;

                let name = await this.app.getAction( ReadObjectName ).run( addr );
                
                if( !name )
                    throw new Error( `Player with name '${name}' can not be determined.` );

                insideEngine = !name.includes( 'Conductor' );
            }
        }

        if( !addr || addr === BigInt( 0 ) )
            throw new Error( `Invalid player address` );

        return [ addr, insideEngine ];
    }

}