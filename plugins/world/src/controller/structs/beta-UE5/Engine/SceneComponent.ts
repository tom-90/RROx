import {  Property, Struct, StructInfo } from "@rrox/api";
import { FRotator } from "../CoreUObject/Rotator";
import { FVector } from "../CoreUObject/Vector";
import { UActorComponent } from "./ActorComponent";

@Struct( "Class Engine.SceneComponent" )
export class USceneComponent extends UActorComponent {

    constructor( struct: StructInfo<USceneComponent> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "AttachParent", () => USceneComponent )
    public AttachParent: USceneComponent;

    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "RelativeLocation", () => FVector )
    public RelativeLocation: FVector;
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "RelativeRotation", () => FRotator )
    public RelativeRotation: FRotator;
    
}