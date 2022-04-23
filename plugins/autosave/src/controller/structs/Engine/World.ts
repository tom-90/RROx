import { Property, Struct, StructInfo } from "@rrox/api";
import { AarrGameModeBase } from "../arr/arrGameModeBase";

@Struct( "Class Engine.World" )
export class UWorld {

    constructor( struct: StructInfo<UWorld> ) {
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "AuthorityGameMode", () => AarrGameModeBase )
    public ARRGameMode: AarrGameModeBase;

}