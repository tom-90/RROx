import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "ScriptStruct CoreUObject.LinearColor" )
export class FLinearColor {

    constructor( struct: StructInfo<FLinearColor> ) {
        struct.apply( this );
    }

    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "R" )
    public R: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "G" )
    public G: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "B" )
    public B: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "A" )
    public A: float;
    
}