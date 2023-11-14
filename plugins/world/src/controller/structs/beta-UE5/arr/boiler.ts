import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Boiler" )
export class Aboiler extends AActor {

    constructor( struct: StructInfo<Aboiler> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxBoilerPressure" )
    public maxboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinBoilerPressure" )
    public minboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentBoilerPressure" )
    public currentboilerpressure: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "PressureLoss" )
    public pressureloss: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentPressureAdd" )
    public currentpressureadd: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "RegulatorSetting" )
    public regulatorsetting: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "ReverserSetting" )
    public reversersetting: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "BoilerPressureFactor" )
    public boilerpressurefactor: float;
    
    /**
     * A boolean property.
     */
    @Property.Bool( "bHasUnlimitedSteam" )
    public bhasunlimitedsteam: boolean;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWaterAmount" )
    public maxwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinWaterAmount" )
    public minwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentWaterAmount" )
    public currentwateramount: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "WaterFactor" )
    public waterfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentWaterConsumption" )
    public currentwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWaterConsumption" )
    public maxwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinWaterConsumption" )
    public minwaterconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWaterTemperature" )
    public maxwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinWaterTemperature" )
    public minwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentWaterTemperature" )
    public currentwatertemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxFuel" )
    public maxfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinFuel" )
    public minfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentFuel" )
    public currentfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "FuelFactor" )
    public fuelfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "FuelConsumption" )
    public fuelconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxFireTemperature" )
    public maxfiretemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinFireTemperature" )
    public minfiretemperature: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentFireTemperature" )
    public currentfiretemperature: float;
    
}