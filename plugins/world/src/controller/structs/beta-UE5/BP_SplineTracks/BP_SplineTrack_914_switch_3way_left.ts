import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_switch_3way_left.BP_SplineTrack_914_switch_3way_left_C" )
export class ABP_SplineTrack_914_switch_3way_left_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_switch_3way_left_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.SWITCH_3WAY_3FT_LEFT;
    public readonly maxSwitchState = 2;

}