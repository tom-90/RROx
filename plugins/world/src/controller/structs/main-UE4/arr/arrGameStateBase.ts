import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { FVector } from "../CoreUObject/Vector";
import { AGameStateBase } from "../Engine/GameStateBase";
import { Aframecar } from "./framecar";
import { Aindustry } from "./industry";
import { Asandhouse } from "./sandhouse";
import { ASplineActor } from "./SplineActor";
import { ASwitch } from "./Switch";
import { Aturntable } from "./turntable";
import { Awatertower } from "./watertower";

@Struct( "Class arr.arrGameStateBase" )
export class AarrGameStateBase extends AGameStateBase {

    constructor( struct: StructInfo<AarrGameStateBase> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An array containing:
     * String property
     */
    @Property.Array( "playeridarray", [] )
    public playeridarray: Array<string>;
    
    /**
     * An array containing:
     * String property
     */
    @Property.Array( "playernamearray", [] )
    public playernamearray: Array<string>;
    
    /**
     * An array containing:
     * Struct property
     */
    @Property.Array( "playerlocationarray", [ () => FVector ] )
    public playerlocationarray: Array<FVector>;
    
    /**
     * An array containing:
     * Float number property
     */
    @Property.Array( "playermoneyarray", [] )
    public playermoneyarray: Array<float>;
    
    /**
     * An array containing:
     * 32-bit int number property
     */
    @Property.Array( "playerxparray", [] )
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
    @Property.Array( "SwitchArray", [ () => ASwitch ] )
    public SwitchArray: Array<ASwitch>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "TurntableArray", [ () => Aturntable ] )
    public TurntableArray: Array<Aturntable>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "WatertowerArray", [ () => Awatertower ] )
    public WatertowerArray: Array<Awatertower>;
    
    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "SandhouseArray", [ () => Asandhouse ] )
    public SandhouseArray: Array<Asandhouse>;
    
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