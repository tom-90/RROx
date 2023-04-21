import { NameRef, Property, Struct, StructInfo } from "@rrox/api";
import { FVector_NetQuantize } from "../CoreUObject/FVector_NetQuantize";

@Struct( "ScriptStruct Engine.HitResult" )
export class FHitResult {

    constructor( struct: StructInfo<FHitResult> ) {
        struct.apply( this );
    }
    
    /**
     * A struct property containing information of a subobject.
     */
    @Property.Struct( "ImpactPoint", () => FVector_NetQuantize )
    public ImpactPoint: FVector_NetQuantize;

}