import { Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { UWorld } from "./World";

@Struct( "Class Engine.GameViewportClient" )
export class UGameViewportClient extends UObject {

    constructor( struct: StructInfo<UGameViewportClient> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "World", () => UWorld )
    public World: UWorld;

}