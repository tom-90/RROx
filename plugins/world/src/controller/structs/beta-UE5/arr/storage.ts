import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { Acrane } from "./crane";
import { Achute } from "./chute";
import { EFreightType } from "./efreighttype";

@Struct( "Class arr.Storage" )
export class Astorage extends AActor {

    constructor( struct: StructInfo<Astorage> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An array containing:
     * Enum property
     */
    @Property.Array( "HoldableFreightTypes", [ EFreightType ] )
    public HoldableFreightTypes: Array<EFreightType>;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxItemsNum" )
    public maxitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MinItemsNum" )
    public minitems: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "CurrentItemsNum" )
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