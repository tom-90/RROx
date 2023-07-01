import { Property, Struct, StructInfo } from "@rrox/api";
import { AInfo } from "./Info";
import { APawn } from "./Pawn";

@Struct( "Class Engine.PlayerState" )
export class APlayerState extends AInfo {

    constructor( struct: StructInfo<APlayerState> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "PawnPrivate", () => APawn )
    public PawnPrivate: APawn;
    
    /**
     * A string property.
     */
    @Property.Str( "PlayerNamePrivate" )
    public PlayerNamePrivate: string;
    
}