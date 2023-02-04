import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { Acrane } from "./crane";
import { Achute } from "./chute";

@Struct( "Class arr.storage" )
export class Astorage extends AActor {

    constructor( struct: StructInfo<Astorage> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A string property.
     */
    @Property.Str( "storagetype" )
    public storagetype: string;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "maxitems" )
    public maxitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "minitems" )
    public minitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentamountitems" )
    public currentamountitems: float;
	
	/**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mycrane1", () => Acrane )
    public Mycrane1: Acrane;
	
	/**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mycrane2", () => Acrane )
    public Mycrane2: Acrane;
	
	/**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mycrane3", () => Acrane )
    public Mycrane3: Acrane;
	
	/**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mychute1", () => Achute )
    public Mychute1: Achute;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mychute2", () => Achute )
    public Mychute2: Achute;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mychute3", () => Achute )
    public Mychute3: Achute;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mychute4", () => Achute )
    public Mychute4: Achute;
	
    
}