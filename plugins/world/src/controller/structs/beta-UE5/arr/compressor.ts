import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.compressor" )
export class Acompressor extends AActor {

    constructor( struct: StructInfo<Acompressor> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "powerHP" )
    public powerHP: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "operatingvalue" )
    public operatingvalue: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxenergyconsumption" )
    public maxenergyconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentenergyconsumption" )
    public currentenergyconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxairpressure" )
    public maxairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minairpressure" )
    public minairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentairpressure" )
    public currentairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentpressurefactor" )
    public currentpressurefactor: float;
    
}