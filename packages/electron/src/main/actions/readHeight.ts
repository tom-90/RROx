import { Action } from "./action";
import { PipeType } from "../pipes";
import Log from 'electron-log';
import { ReadAddressAction, ReadAddressMode } from './readAddress';

export class ReadHeightAction extends Action<false | number, [ x: number, y: number ]> {

    public actionID   = 7;
    public actionName = 'Read World Height';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number ): Promise<false | number> {
        
        let world  = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'World' );
        let kismet = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'KismetSystemLibrary' );;

        if ( !world || !kismet ) {
            Log.info( 'Not in game: World/Kismet not found', world, kismet );
            return false;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );


        pipe.writeInt( this.actionID );
        pipe.writeUInt64( kismet );
        pipe.writeUInt64( world );
        pipe.writeFloat( x );
        pipe.writeFloat( y );

        let z = await pipe.readFloat();

        console.log( z );

        return z;
    }

}
