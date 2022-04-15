import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Freight" )
export class AFreight extends AActor {

    constructor( struct: StructInfo<AFreight> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A string property.
     */
    @Property.Str( "LoadableFreight" )
    public LoadableFreight: string;
    
    /**
     * A string property.
     */
    @Property.Str( "currentfreighttype" )
    public currentfreighttype: string;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "specificFreightMass" )
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
    @Property.Int( "currentfreight" )
    public currentfreight: int32;
    
    /**
     * A string property.
     */
    @Property.Str( "currentunloader" )
    public currentunloader: string;
    
}