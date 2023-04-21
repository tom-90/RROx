import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_turntable_nevada.BP_SplineTrack_914_turntable_nevada_C" )
export class ABP_SplineTrack_914_turntable_nevada_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_turntable_nevada_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.TURNTABLE_3FT_NEVADA;

}