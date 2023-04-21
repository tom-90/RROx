import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "ScriptStruct CoreUObject.Vector" )
export class FVector {

    constructor( struct: StructInfo<FVector> ) {
        struct.apply( this );
    }

    /**
     * A `double` number property (contains decimal digits).
     */
    @Property.Double( "X" )
    public X: double;
    
    /**
     * A `double` number property (contains decimal digits).
     */
    @Property.Double( "Y" )
    public Y: double;
    
    /**
     * A `double` number property (contains decimal digits).
     */
    @Property.Double( "Z" )
    public Z: double;
    
}