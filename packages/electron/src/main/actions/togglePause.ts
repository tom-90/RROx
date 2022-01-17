import { Action } from "./action";
import { ReadAddressAction, ReadAddressMode } from '.';
import { PipeType } from "../pipes";
import Log from 'electron-log';

export class TogglePauseAction extends Action<void | false, []> {

    public actionID   = 10;
    public actionName = 'Toggle Pause Action';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute(): Promise<void | false> {
        let playerController = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'PlayerController' );

        if( !playerController ) {
            Log.info( 'PlayerController not found', playerController );
            return false;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( playerController );
    }

}
