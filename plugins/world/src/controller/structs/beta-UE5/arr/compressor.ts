import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Compressor" )
export class Acompressor extends AActor {

    constructor( struct: StructInfo<Acompressor> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "PowerHP" )
    public powerHP: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "OperatingValue" )
    public operatingvalue: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxEnergyConsumption" )
    public maxenergyconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentEnergyConsumption" )
    public currentenergyconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxAirPressure" )
    public maxairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinAirPressure" )
    public minairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentAirPressure" )
    public currentairpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentPressureFactor" )
    public currentpressurefactor: float;
    
}