import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "ScriptStruct CoreUObject.Rotator" )
export class FRotator {

    constructor( struct: StructInfo<FRotator> ) {
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Double( "Pitch" )
    public Pitch: double;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Double( "Yaw" )
    public Yaw: double;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Double( "Roll" )
    public Roll: double;
    
}