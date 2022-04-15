import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { Astorage } from "./storage";

@Struct( "Class arr.industry" )
export class Aindustry extends AActor {

    constructor( struct: StructInfo<Aindustry> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageeducts1", () => Astorage )
    public mystorageeducts1: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageeducts2", () => Astorage )
    public mystorageeducts2: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageeducts3", () => Astorage )
    public mystorageeducts3: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageeducts4", () => Astorage )
    public mystorageeducts4: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageproducts1", () => Astorage )
    public mystorageproducts1: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageproducts2", () => Astorage )
    public mystorageproducts2: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageproducts3", () => Astorage )
    public mystorageproducts3: Astorage;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "mystorageproducts4", () => Astorage )
    public mystorageproducts4: Astorage;
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "industrytype" )
    public industrytype: int32;
    
}