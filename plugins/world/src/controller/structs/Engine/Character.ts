import { Struct, StructInfo } from "@rrox/api";
import { APawn } from "./Pawn";

@Struct( "Class Engine.Character" )
export class ACharacter extends APawn {

    constructor( struct: StructInfo<ACharacter> ) {
        super( struct );
        struct.apply( this );
    }

}