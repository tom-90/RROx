import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_ballast_h10.BP_SplineTrack_ballast_h10_C" )
export class ABP_SplineTrack_ballast_h10_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_ballast_h10_C> ) {
        super( struct );
        struct.apply( this );
    }

    public readonly type = SplineTrackType.BALLAST_H10;

}