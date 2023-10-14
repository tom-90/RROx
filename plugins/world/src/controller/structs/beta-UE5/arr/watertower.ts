import { Property, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { Astorage } from "./storage";

// Struct decorator will be placed dynamically based on detected name
export class Awatertower extends AActor {

    constructor( struct: StructInfo<Awatertower> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "watertowertype" )
    public watertowertype: int32;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mystorage", () => Astorage )
    public Mystorage: Astorage;
    
}