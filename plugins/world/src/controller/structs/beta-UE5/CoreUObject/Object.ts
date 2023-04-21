import { Struct, StructInfo } from "@rrox/api";

@Struct( "Class CoreUObject.Object" )
export class UObject {

    constructor( struct: StructInfo<UObject> ) {
        struct.apply( this );
    }
    
}