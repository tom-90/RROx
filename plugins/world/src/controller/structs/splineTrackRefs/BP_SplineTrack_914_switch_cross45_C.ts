import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_switch_cross45.BP_SplineTrack_914_switch_cross45_C" )
export class ABP_SplineTrack_914_switch_cross45_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_switch_cross45_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.CROSS45_3FT;

}