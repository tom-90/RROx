import { Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { UActorChannel } from "./ActorChannel";
import { UChannel } from "./Channel";

@Struct( "Class Engine.NetConnection" )
export class UNetConnection extends UObject {

    constructor( struct: StructInfo<UNetConnection> ) {
        super( struct );
        struct.apply( this );
    }
    
    @Property.Array( "OpenChannels", [ () => UActorChannel ] )
    public OpenActorChannels: Array<UActorChannel>;

}