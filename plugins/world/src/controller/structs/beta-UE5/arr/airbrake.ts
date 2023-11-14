import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.AirBrake" )
export class Aairbrake extends AActor {

    constructor( struct: StructInfo<Aairbrake> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "BrakeValue" )
    public brakevalue: float;
    
}