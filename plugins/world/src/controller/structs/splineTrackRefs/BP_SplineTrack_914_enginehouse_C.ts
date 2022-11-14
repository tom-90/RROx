import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_enginehouse.BP_SplineTrack_914_enginehouse_C" )
export class ABP_SplineTrack_914_enginehouse_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_enginehouse_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.RAIL_3FT_ENGINEHOUSE;

}