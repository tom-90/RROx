import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.whistle" )
export class Awhistle extends AActor {

    constructor( struct: StructInfo<Awhistle> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "whistleopenfactor" )
    public whistleopenfactor: float;
    
}