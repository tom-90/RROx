import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.handvalve" )
export class Ahandvalve extends AActor {

    constructor( struct: StructInfo<Ahandvalve> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "openPercentage" )
    public openPercentage: float;
    
}