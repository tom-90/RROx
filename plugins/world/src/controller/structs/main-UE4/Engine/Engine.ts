import { Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { UGameViewportClient } from "./GameViewportClient";

@Struct( "Class Engine.Engine" )
export class UEngine extends UObject {

    constructor( struct: StructInfo<UEngine> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "GameViewport", () => UGameViewportClient )
    public GameViewport: UGameViewportClient;

}