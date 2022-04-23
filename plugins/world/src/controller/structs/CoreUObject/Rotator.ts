import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "ScriptStruct CoreUObject.Rotator" )
export class FRotator {

    constructor( struct: StructInfo<FRotator> ) {
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "Pitch" )
    public Pitch: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "Yaw" )
    public Yaw: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "Roll" )
    public Roll: float;
    
}