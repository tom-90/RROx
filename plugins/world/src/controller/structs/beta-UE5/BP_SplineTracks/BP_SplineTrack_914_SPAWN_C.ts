import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_SPAWN.BP_SplineTrack_914_SPAWN_C" )
export class ABP_SplineTrack_914_SPAWN_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_SPAWN_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.RAIL_3FT_SPAWN;

}