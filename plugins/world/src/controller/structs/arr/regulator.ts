import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.regulator" )
export class Aregulator extends AActor {

    constructor( struct: StructInfo<Aregulator> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "openPercentage" )
    public openPercentage: float;
    
}