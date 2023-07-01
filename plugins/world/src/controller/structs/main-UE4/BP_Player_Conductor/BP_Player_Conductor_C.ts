import { Struct, StructInfo } from "@rrox/api";
import { ASCharacter } from "../arr/SCharacter";

@Struct( "BlueprintGeneratedClass BP_Player_Conductor.BP_Player_Conductor_C" )
export class ABP_Player_Conductor_C extends ASCharacter {

    constructor( struct: StructInfo<ABP_Player_Conductor_C> ) {
        super( struct );
        struct.apply( this );
    }

}