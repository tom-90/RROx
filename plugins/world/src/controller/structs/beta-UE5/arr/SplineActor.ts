import { Property, Struct, StructInfo } from "@rrox/api";
import { FVector_NetQuantize } from "../CoreUObject/FVector_NetQuantize";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.SplineActorDeprecated" )
export class ASplineActor extends AActor {

    constructor( struct: StructInfo<ASplineActor> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "SplineType" )
    public SplineType: int32;

    /**
     * An array containing:
     * Struct property
     */
    @Property.Array( "SplineControlPoints", [ () => FVector_NetQuantize ] )
    public SplineControlPoints: Array<FVector_NetQuantize>;
    
    /**
     * An array containing:
     * Boolean property
     */
    @Property.Array( "SplineMeshBoolArray", [] )
    public SplineMeshBoolArray: Array<boolean>;
    
}