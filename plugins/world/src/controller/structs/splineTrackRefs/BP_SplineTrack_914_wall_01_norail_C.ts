import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_wall_01_norail.BP_SplineTrack_914_wall_01_norail_C" )
export class ABP_SplineTrack_914_wall_01_norail_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_wall_01_norail_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.WALL_01;

}