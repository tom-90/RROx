import { Property, Struct, StructInfo } from "@rrox/api";
import { UWorld } from "./World";

@Struct( "Class Engine.GameViewportClient" )
export class UGameViewportClient {

    constructor( struct: StructInfo<UGameViewportClient> ) {
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "World", () => UWorld )
    public World: UWorld;

}