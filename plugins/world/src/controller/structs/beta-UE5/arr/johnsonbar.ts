import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.johnsonbar" )
export class Ajohnsonbar extends AActor {

    constructor( struct: StructInfo<Ajohnsonbar> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "forwardvalue" )
    public forwardvalue: float;
    
}