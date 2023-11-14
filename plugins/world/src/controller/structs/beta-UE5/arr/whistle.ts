import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Whistle" )
export class Awhistle extends AActor {

    constructor( struct: StructInfo<Awhistle> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "WhistleOpenFactor" )
    public whistleopenfactor: float;
    
}