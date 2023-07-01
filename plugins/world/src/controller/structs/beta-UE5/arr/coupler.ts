import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.coupler" )
export class Acoupler extends AActor {

    constructor( struct: StructInfo<Acoupler> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A boolean property.
     */
    @Property.Bool( "bHasLink" )
    public bHasLink: boolean;
    
    /**
     * A boolean property.
     */
    @Property.Bool( "bHasPin" )
    public bHasPin: boolean;
    
    /**
     * A boolean property.
     */
    @Property.Bool( "bIsCoupled" )
    public bIsCoupled: boolean;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "OtherCoupler", () => Acoupler )
    public OtherCoupler: Acoupler;
    
}