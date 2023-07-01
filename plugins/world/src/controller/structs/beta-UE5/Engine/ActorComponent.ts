import { Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";

@Struct( "Class Engine.ActorComponent" )
export class UActorComponent extends UObject {

    constructor( struct: StructInfo<UActorComponent> ) {
        super( struct );
        struct.apply( this );
    }

}