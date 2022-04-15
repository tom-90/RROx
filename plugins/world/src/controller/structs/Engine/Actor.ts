import { InOutParam, NameRef, Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { USceneComponent } from "./SceneComponent";

@Struct( "Class Engine.Actor" )
export class AActor extends UObject {

    constructor( struct: StructInfo<AActor> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "RootComponent", () => USceneComponent )
    public RootComponent: USceneComponent;
    
}