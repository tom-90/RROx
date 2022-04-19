import { Property, Struct, StructInfo } from "@rrox/api";
import { UGameViewportClient } from "./GameViewportClient";

@Struct( "Class Engine.GameEngine" )
export class UGameEngine {

    constructor( struct: StructInfo<UGameEngine> ) {
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "GameViewport", () => UGameViewportClient )
    public GameViewport: UGameViewportClient;
    
}