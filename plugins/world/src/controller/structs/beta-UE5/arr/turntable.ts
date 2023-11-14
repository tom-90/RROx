import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { USceneComponent } from "../Engine/SceneComponent";

@Struct( "Class arr.Turntable" )
export class Aturntable extends AActor {

    constructor( struct: StructInfo<Aturntable> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "turntabletype" )
    public turntabletype: int32;

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "DeckMesh", () => USceneComponent )
    public deckmesh: USceneComponent;    
}