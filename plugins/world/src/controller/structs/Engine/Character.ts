import { Property, Struct, StructInfo } from "@rrox/api";
import { UCharacterMovementComponent } from "./CharacterMovementComponent";
import { APawn } from "./Pawn";

@Struct( "Class Engine.Character" )
export class ACharacter extends APawn {

    constructor( struct: StructInfo<ACharacter> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "CharacterMovement", () => UCharacterMovementComponent )
    public CharacterMovement: UCharacterMovementComponent;

}