import { Struct, StructInfo } from "@rrox/api";
import { UEngine } from "./Engine";

@Struct( "Class Engine.GameEngine" )
export class UGameEngine extends UEngine {

    constructor( struct: StructInfo<UGameEngine> ) {
        super( struct );
        struct.apply( this );
    }
    
}