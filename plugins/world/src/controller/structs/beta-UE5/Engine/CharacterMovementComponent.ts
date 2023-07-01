import { Property, Struct, StructInfo } from "@rrox/api";
import { UActorComponent } from "./ActorComponent";
import { EMovementMode } from "./EMovementMode";

@Struct( "Class Engine.CharacterMovementComponent" )
export class UCharacterMovementComponent extends UActorComponent {

    constructor( struct: StructInfo<UCharacterMovementComponent> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An enum property.
     */
    @Property.Byte( "MovementMode", () => EMovementMode )
    public MovementMode: EMovementMode;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxWalkSpeed" )
    public MaxWalkSpeed: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "MaxFlySpeed" )
    public MaxFlySpeed: float;


}