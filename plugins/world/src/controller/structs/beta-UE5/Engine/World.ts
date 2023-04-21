import { Property, Struct, StructInfo } from "@rrox/api";
import { AarrGameStateBase } from "../arr/arrGameStateBase";
import { UNetDriver } from "./NetDriver";

@Struct( "Class Engine.World" )
export class UWorld {

    constructor( struct: StructInfo<UWorld> ) {
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "GameState", () => AarrGameStateBase )
    public ARRGameState: AarrGameStateBase;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "NetDriver", () => UNetDriver )
    public NetDriver: UNetDriver;

}