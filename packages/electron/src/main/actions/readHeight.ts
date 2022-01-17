import { Action } from "./action";
import { ReadAddressAction, ReadAddressMode } from '.';
import { PipeType } from "../pipes";
import Log from 'electron-log';

export class ReadHeightAction extends Action<false | number, [ x: number, y: number, ignoredAddresses?: bigint[], addrKismet?: bigint, addrWorldObj?: bigint ]> {

    public actionID   = 8;
    public actionName = 'Read Height';
    public pipes      = [ PipeType.DLLInjectorData ];

    protected async execute( x: number, y: number, ignoredAddresses: bigint[] = [], addrKismet?: bigint, addrWorldObj?: bigint ): Promise<false | number> {
        if( !addrKismet ) {
            let kismet = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'KismetSystemLibrary' );

            if( !kismet ) {
                Log.info( 'Kismet not found', kismet );
                return false;
            }

            addrKismet = kismet;
        }

        if( !addrWorldObj ) {
            let world = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'World' );

            if( !world ) {
                Log.info( 'World not found', world );
                return false;
            }

            addrWorldObj = world;
        }

        await this.acquire();

        let pipe = this.app.getPipe( PipeType.DLLInjectorData );

        pipe.writeInt( this.actionID );
        pipe.writeUInt64( addrKismet );
        pipe.writeUInt64( addrWorldObj );

        pipe.writeInt( ignoredAddresses.length );
        for( let address of ignoredAddresses )
            pipe.writeUInt64( address );

        pipe.writeFloat( x );
        pipe.writeFloat( y );

        return await pipe.readFloat();
    }

}
