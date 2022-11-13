import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_switch_cross90.BP_SplineTrack_914_switch_cross90_C" )
export class ABP_SplineTrack_914_switch_cross90_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_switch_cross90_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.CROSS90_3FT;

}