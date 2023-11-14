import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { EFreightType } from "./efreighttype";

@Struct( "Class arr.Freight" )
export class AFreight extends AActor {

    constructor( struct: StructInfo<AFreight> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An array containing:
     * Enum property
     */
    @Property.Array( "LoadableFreight", [ EFreightType ] )
    public LoadableFreight: Array<EFreightType>;
    
    /**
     * A enum property,
     */
    @Property.Enum( "CurrentTypeOfFreight", () => EFreightType )
    public currentfreighttype: EFreightType;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "SpecificFreightMass" )
    public specificFreightMass: float;
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "maxfreight" )
    public maxfreight: int32;
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "CurrentFreight" )
    public currentfreight: int32;
    
    /**
     * A string property.
     */
    @Property.Str( "CurrentUnloader" )
    public currentunloader: string;
    
}