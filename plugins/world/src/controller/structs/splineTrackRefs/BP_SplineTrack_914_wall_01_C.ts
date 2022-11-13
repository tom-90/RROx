import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_wall_01.BP_SplineTrack_914_wall_01_C" )
export class ABP_SplineTrack_914_wall_01_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_wall_01_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.RAIL_WALL_3FT_01;

}