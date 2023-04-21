import { Property, Struct, StructInfo } from "@rrox/api";
import { AInfo } from "./Info";
import { APlayerState } from "./PlayerState";

@Struct( "Class Engine.GameStateBase" )
export class AGameStateBase extends AInfo {

    constructor( struct: StructInfo<AGameStateBase> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An array containing:
     * Object property
     */
    @Property.Array( "PlayerArray", [ () => APlayerState ] )
    public PlayerArray: Array<APlayerState>;

}