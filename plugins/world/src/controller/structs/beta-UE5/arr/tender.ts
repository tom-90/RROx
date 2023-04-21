import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.tender" )
export class Atender extends AActor {

    constructor( struct: StructInfo<Atender> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxamountfuel" )
    public maxamountfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minamountfuel" )
    public minamountfuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentamountFuel" )
    public currentamountFuel: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentamountWater" )
    public currentamountWater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxamountwater" )
    public maxamountwater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minamountwater" )
    public minamountwater: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "tenderwaterfactor" )
    public tenderwaterfactor: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxwaterheight" )
    public maxwaterheight: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentfuelconsumption" )
    public currentfuelconsumption: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentwaterconsumption" )
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