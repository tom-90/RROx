import { Property, Struct, StructInfo } from "@rrox/api";
import { SplineTrackType } from "../../../shared";
import { FVector_NetQuantize } from "../CoreUObject/FVector_NetQuantize";
import { FVector } from "../CoreUObject/Vector";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.SplineTrack" )
export abstract class ASplineTrack extends AActor {

    constructor( struct: StructInfo<ASplineTrack> ) {
        super( struct );
        struct.apply( this );
    }

    public abstract readonly type: SplineTrackType;
    public readonly maxSwitchState: number = 1;

    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "StartLocation", () => FVector_NetQuantize )
    public StartLocation: FVector_NetQuantize;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "EndLocation", () => FVector_NetQuantize )
    public EndLocation: FVector_NetQuantize;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "StartTangent", () => FVector_NetQuantize )
    public StartTangent: FVector_NetQuantize;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "EndTangent", () => FVector_NetQuantize )
    public EndTangent: FVector_NetQuantize;
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "switchstate" )
    public switchstate: int32;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "splinecomp1endrelativelocation", () => FVector )
    public splinecomp1endrelativelocation: FVector;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "splinecomp2endrelativelocation", () => FVector )
    public splinecomp2endrelativelocation: FVector;
    
}