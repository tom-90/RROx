import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_turntable.BP_SplineTrack_914_turntable_C" )
export class ABP_SplineTrack_914_turntable_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_turntable_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.TURNTABLE_3FT;

}