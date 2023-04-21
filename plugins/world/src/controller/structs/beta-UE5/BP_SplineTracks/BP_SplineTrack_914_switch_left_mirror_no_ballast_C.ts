import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_switch_left_mirror_noballast.BP_SplineTrack_914_switch_left_mirror_noballast_C" )
export class ABP_SplineTrack_914_switch_left_mirror_noballast_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_switch_left_mirror_noballast_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.SWITCH_3FT_LEFT_MIRROR;

}