import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { USceneComponent } from "../Engine/SceneComponent";
import { TurntableType } from "../../../../shared";

@Struct( "Class arr.Turntable" )
export abstract class Aturntable extends AActor {

    constructor( struct: StructInfo<Aturntable> ) {
        super( struct );
        struct.apply( this );
    }

    public abstract readonly type: TurntableType;

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "DeckMesh", () => USceneComponent )
    public deckmesh: USceneComponent;    
}