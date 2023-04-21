import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "ScriptStruct CoreUObject.Vector" )
export class FVector {

    constructor( struct: StructInfo<FVector> ) {
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "X" )
    public X: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "Y" )
    public Y: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "Z" )
    public Z: float;
    
}