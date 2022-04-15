import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Switch" )
export class ASwitch extends AActor {

    constructor( struct: StructInfo<ASwitch> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "switchtype" )
    public switchtype: int32;

    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "switchstate" )
    public switchstate: int32;
    
}