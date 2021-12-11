import { Action } from "./action";
import { ReadAddressAction, ReadAddressMode, ReadAddressValueAction } from ".";
import { PipeType } from "../pipes";

export enum GameMode {
    CLIENT = 'CLIENT',
    HOST = 'HOST',
}

export class EnsureInGameAction extends Action<false | GameMode> {

    public actionID   = 4;
    public actionName = 'Ensure In Game';
    public pipes      = [ PipeType.DLLInjectorData ];

    private inGameTime?: number;

    protected async execute(): Promise<false | GameMode> {
        if( !this.canRun() )
            return false;

        let frameArraySize = await this.app.getAction( ReadAddressValueAction ).run( 'FrameArraySize' );

        // We check if the frame array size has some (sensible) value
        if( !frameArraySize || frameArraySize === '??' || Number( frameArraySize ) > 1000 ) {
            this.inGameTime = null;
            return false;
        }

        // We only start processing 2 seconds after the player has entered the game
        // This is to reduce the number of access violations due to wrong memory addresses
        if( this.inGameTime && ( new Date().getTime() - this.inGameTime ) < 2000 )
            return false;
        else if( !this.inGameTime ) {
            this.inGameTime = new Date().getTime(); 
            return false;
        }

        let world  = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'World' );
        let kismet = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'KismetSystemLibrary' );;

        if( !world || !kismet )
            return false;

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        // Check if game is server

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( kismet );
        pipe.writeUInt64( world );

        let returnValue = await pipe.readInt();
        
        if( returnValue !== 1 )
            return GameMode.CLIENT;

        return GameMode.HOST;
    }

    public canRun() {
        return super.canRun() && this.app.getAction( ReadAddressAction ).canRun() && this.app.getAction( ReadAddressValueAction ).canRun();
    }

}