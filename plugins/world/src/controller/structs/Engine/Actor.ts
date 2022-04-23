import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { FVector } from "../CoreUObject/Vector";
import { FHitResult } from "./HitResult";
import { USceneComponent } from "./SceneComponent";

@Struct( "Class Engine.Actor" )
export class AActor extends UObject {

    constructor( struct: StructInfo<AActor> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "RootComponent", () => USceneComponent )
    public RootComponent: USceneComponent;
    
    /**
     * @param NewLocation Struct property
     * @param bSweep Boolean property
     * @param SweepHitResult Struct property
     * @param bTeleport Boolean property
     * @return Boolean property
     * @flags Final, Native, Public, HasOutParms, HasDefaults, BlueprintCallable
     */
    @Property.Function( "Function Engine.Actor.K2_SetActorLocation", [ [ () => FVector ], [], [ () => FHitResult ], [], [] ] )
    public K2_SetActorLocation: ( NewLocation: FVector, bSweep: boolean, SweepHitResult: InOutParam<FHitResult>, bTeleport: boolean ) => Promise<boolean>;
    
}