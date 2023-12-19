import { Struct, StructInfo } from "@rrox/api";
import { Aturntable } from "../arr";
import { TurntableType } from "../../../../shared";

@Struct( "BlueprintGeneratedClass BP_turntable_steel_nevada.BP_turntable_steel_nevada_C" )
export class ABP_turntable_steel_nevada_C extends Aturntable {

    constructor( struct: StructInfo<ABP_turntable_steel_nevada_C> ) {
        super( struct );
        struct.apply( this );
    }

    type = TurntableType.TURNTABLE_II;

}