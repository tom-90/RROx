import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_switch_3way_right_noballast.BP_SplineTrack_914_switch_3way_right_noballast_C" )
export class ABP_SplineTrack_914_switch_3way_right_noballast_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_switch_3way_right_noballast_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.SWITCH_3WAY_BALLAST_3FT_RIGHT;
    public readonly maxSwitchState = 2;

}