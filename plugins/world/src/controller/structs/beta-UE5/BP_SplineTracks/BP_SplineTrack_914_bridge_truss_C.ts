import { Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../../shared";
import { ASplineTrack } from "../arr/SplineTrack";

@Struct( "BlueprintGeneratedClass BP_SplineTrack_914_bridge_truss.BP_SplineTrack_914_bridge_truss_C" )
export class ABP_SplineTrack_914_bridge_truss_C extends ASplineTrack {

    constructor( struct: StructInfo<ABP_SplineTrack_914_bridge_truss_C> ) {
        super( struct );
        struct.apply( this );
    }

	public readonly type = SplineTrackType.BRIDGE_3FT_STEEL_TRUSS_01;

}