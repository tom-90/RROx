import { Struct, StructInfo } from "@rrox/api";
import { FVector } from "./Vector";

@Struct( "ScriptStruct Engine.Vector_NetQuantize" )
export class FVector_NetQuantize extends FVector {

    constructor( struct: StructInfo<FVector_NetQuantize> ) {
        super( struct );
        struct.apply( this );
    }

}