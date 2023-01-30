import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.crane" )
export class Acrane extends AActor {

    constructor( struct: StructInfo<Acrane> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A string property.
     */
    @Property.Str( "freighttype" )
    public freighttype: string;
    
    /**
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.crane.LoadFreight" )
    public LoadFreight: () => Promise<void>;
 
}