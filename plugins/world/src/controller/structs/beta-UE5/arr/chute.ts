import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";

@Struct( "Class arr.Chute" )
export class Achute extends AActor {

    constructor( struct: StructInfo<Achute> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A string property.
     */
    @Property.Str( "freighttype" )
    public freighttype: string;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "FreightRespawnTime" )
    public freightrespawntime: float;
    
    /**
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.chute.SpawnFreight" )
    public SpawnFreight: () => Promise<void>;
    
}