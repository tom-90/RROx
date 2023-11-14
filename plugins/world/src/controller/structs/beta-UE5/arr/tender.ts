import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Tender" )
export class Atender extends AActor {

    constructor( struct: StructInfo<Atender> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxFuelAmount" )
    public maxamountfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinFuelAmount" )
    public minamountfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentFuelAmount" )
    public currentamountFuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentWaterAmount" )
    public currentamountWater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWaterAmount" )
    public maxamountwater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinWaterAmount" )
    public minamountwater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "TenderWaterFactor" )
    public tenderwaterfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWaterHeight" )
    public maxwaterheight: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentfuelconsumption" )
    public currentfuelconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentWaterConsumption" )
    public currentwaterconsumption: float;
    
    /**
     * A `uint8` number property, containing only positive numbers (range `0` to `+255`).
     * 
     * @min `0`
     * @max `+255`
     */
    @Property.Byte( "tendertype" )
    public tendertype: uint8;
    
}