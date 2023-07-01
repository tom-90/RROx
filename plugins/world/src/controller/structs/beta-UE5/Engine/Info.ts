import { Struct, StructInfo } from "@rrox/api";
import { AActor } from "./Actor";

@Struct( "Class Engine.Info" )
export class AInfo extends AActor {

    constructor( struct: StructInfo<AInfo> ) {
        super( struct );
        struct.apply( this );
    }

}