import { Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { UNetConnection } from "./NetConnection";

@Struct( "Class Engine.Channel" )
export class UChannel extends UObject {

    constructor( struct: StructInfo<UChannel> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Connection", () => UNetConnection )
    public Connection: UNetConnection;
    
}