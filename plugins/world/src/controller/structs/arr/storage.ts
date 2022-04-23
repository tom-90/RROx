import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.storage" )
export class Astorage extends AActor {

    constructor( struct: StructInfo<Astorage> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A string property.
     */
    @Property.Str( "storagetype" )
    public storagetype: string;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxitems" )
    public maxitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minitems" )
    public minitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentamountitems" )
    public currentamountitems: float;
    
}