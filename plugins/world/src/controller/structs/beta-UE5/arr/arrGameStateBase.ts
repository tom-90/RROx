import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { FVector } from "../CoreUObject/Vector";
import { AGameStateBase } from "../Engine/GameStateBase";
import { Aframecar } from "./framecar";
import { Aindustry } from "./industry";
import { Asandhouse } from "./sandhouse";
import { ASplineActor } from "./SplineActor";
import { Aturntable } from "./turntable";
import { Awatertower } from "./watertower";

@Struct( "Class arr.ARRGameStateBase" )
export class AarrGameStateBase extends AGameStateBase {

    constructor( struct: StructInfo<AarrGameStateBase> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An array containing:
     * String property
     */
    @Property.Array( "playerIdArray", [] )
    public playeridarray: Array<string>;
    
    /**
     * An array containing:
     * String property
     */
    @Property.Array( "playerNameArray", [] )
    public playernamearray: Array<string>;
    
    /**
     * An array containing:
     * Struct property
     */
    @Property.Array( "playerLocationArray", [ () => FVector ] )
    public playerlocationarray: Array<FVector>;
    
    /**
     * An array containing:
     * Float number property
     */
    @Property.Array( "playerMoneyArray", [] )
    public playermoneyarray: Array<float>;
    
    /**
     * An array containing:
     * 32-bit int number property
     */
    @Property.Array( "playerXpArray", [] )
    public playerxparray: Array<int32>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "SplineArray", [ () => ASplineActor ] )
    public SplineArray: Array<ASplineActor>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "IndustryArray", [ () => Aindustry ] )
    public IndustryArray: Array<Aindustry>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "FrameCarArray", [ () => Aframecar ] )
    public FrameCarArray: Array<Aframecar>;
    
}