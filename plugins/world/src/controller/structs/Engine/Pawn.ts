import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "./Actor";

@Struct( "Class Engine.Pawn" )
export class APawn extends AActor {

    constructor( struct: StructInfo<APawn> ) {
        super( struct );
        struct.apply( this );
    }

}