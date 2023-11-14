import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { Astorage } from "./storage";

@Struct( "Class arr.SandHouse" )
export class Asandhouse extends AActor {

    constructor( struct: StructInfo<Asandhouse> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "SandHouseType" )
    public sandhousetype: int32;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Storage", () => Astorage )
    public Mystorage: Astorage;
    
}