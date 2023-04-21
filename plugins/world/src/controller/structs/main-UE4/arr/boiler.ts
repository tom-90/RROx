import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.boiler" )
export class Aboiler extends AActor {

    constructor( struct: StructInfo<Aboiler> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxboilerpressure" )
    public maxboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minboilerpressure" )
    public minboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentboilerpressure" )
    public currentboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "pressureloss" )
    public pressureloss: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentpressureadd" )
    public currentpressureadd: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "regulatorsetting" )
    public regulatorsetting: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "reversersetting" )
    public reversersetting: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "boilerpressurefactor" )
    public boilerpressurefactor: float;
    
    /**
     * A boolean property.
     */
    @Property.Bool( "bhasunlimitedsteam" )
    public bhasunlimitedsteam: boolean;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxwateramount" )
    public maxwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minwateramount" )
    public minwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentwateramount" )
    public currentwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "waterfactor" )
    public waterfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentwaterconsumption" )
    public currentwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxwaterconsumption" )
    public maxwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minwaterconsumption" )
    public minwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxwatertemperature" )
    public maxwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minwatertemperature" )
    public minwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentwatertemperature" )
    public currentwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxfuel" )
    public maxfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minfuel" )
    public minfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentfuel" )
    public currentfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "fuelfactor" )
    public fuelfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "fuelconsumption" )
    public fuelconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxfiretemperature" )
    public maxfiretemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minfiretemperature" )
    public minfiretemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentfiretemperature" )
    public currentfiretemperature: float;
    
}