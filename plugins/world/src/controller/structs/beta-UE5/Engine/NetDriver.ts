import { NameRef, Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { UNetConnection } from "./NetConnection";

@Struct( "Class Engine.NetDriver" )
export class UNetDriver extends UObject {

    constructor( struct: StructInfo<UNetDriver> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "ServerConnection", () => UNetConnection )
    public ServerConnection: UNetConnection;
    
}