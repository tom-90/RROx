import { Action } from "./action";
import { ReadAddressAction, ReadAddressValueAction } from ".";
import { PipeType } from "../pipes";

export class EnsureInGameAction extends Action<boolean> {

    public actionID   = 4;
    public actionName = 'Ensure In Game';
    public pipes      = [ PipeType.DLLInjectorData ];

    private inGameTime?: number;

    protected async execute(): Promise<boolean> {
        if( !this.canRun() )
            return false;

        let frameArraySize = await this.app.getAction( ReadAddressValueAction ).run( 'FrameArraySize' );

        // We check if the frame array size has some (sensible) value
        if( !frameArraySize || frameArraySize === '??' || Number( frameArraySize ) === 0 || Number( frameArraySize ) > 1000 ) {
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

        let world  = await this.app.getAction( ReadAddressAction ).run( 'global', 'World' );
        let kismet = await this.app.getAction( ReadAddressAction ).run( 'global', 'KismetSystemLibrary' );

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
            return false;

        return true;
    }

    public canRun() {
        return super.canRun() && this.app.getAction( ReadAddressAction ).canRun() && this.app.getAction( ReadAddressValueAction ).canRun();
    }

}