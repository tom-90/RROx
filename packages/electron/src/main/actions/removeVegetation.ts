import { Action } from "./action";
import { PipeType } from "../pipes";
import Log from 'electron-log';
import { ReadPlayerAddress } from "./readPlayerAddress";
import { ReadAddressAction, ReadAddressMode } from "./readAddress";

export class RemoveVegetationAction extends Action<false, [ x: number, y: number, z: number, distance: number ]> {

    public actionID   = 8;
    public actionName = 'Remove Vegetation Action';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number, z: number, distance: number ): Promise<false> {
        let vegetationSpawner = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'VegetationSpawner' );

        if ( !vegetationSpawner ) {
            Log.info( 'Not found vegetation spawner', vegetationSpawner );
            return false;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );


        pipe.writeInt( this.actionID );
        pipe.writeUInt64( vegetationSpawner );
        pipe.writeFloat( x );
        pipe.writeFloat( y );
        pipe.writeFloat( z );
        pipe.writeFloat( distance );
    }

}
