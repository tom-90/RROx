import { Struct, StructInfo } from "@rrox/api";
import { Aturntable } from "../arr";
import { TurntableType } from "../../../../shared";

@Struct( "BlueprintGeneratedClass BP_turntable_steel_deckless.BP_turntable_steel_deckless_C" )
export class ABP_turntable_steel_deckless_C extends Aturntable {

    constructor( struct: StructInfo<ABP_turntable_steel_deckless_C> ) {
        super( struct );
        struct.apply( this );
    }

    type = TurntableType.TURNTABLE_I;

}