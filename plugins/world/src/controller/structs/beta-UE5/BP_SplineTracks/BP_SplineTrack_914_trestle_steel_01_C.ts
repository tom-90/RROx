import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_trestle_steel_01.BP_SplineTrack_914_trestle_steel_01_C" )
export class ABP_SplineTrack_914_trestle_steel_01_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_trestle_steel_01_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.TRESTLE_3FT_STEEL_01;

}