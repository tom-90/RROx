import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { UObject } from "../CoreUObject/Object";
import { FVector } from "../CoreUObject/Vector";
import { FRotator } from "../CoreUObject/Rotator";
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
	
	/**
     * @return Struct property
     * @flags Final, Native, Public, HasDefaults, BlueprintCallable, BlueprintPure, Const
     */
    @Property.Function( "Function Engine.Actor.K2_GetActorLocation", [ [ () => FVector ] ] )
    public K2_GetActorLocation: () => Promise<FVector>;
	
	/**
     * @return Struct property
     * @flags Final, Native, Public, HasDefaults, BlueprintCallable, BlueprintPure, Const
     */
    @Property.Function( "Function Engine.Actor.K2_GetActorRotation", [ [ () => FRotator ] ] )
    public K2_GetActorRotation: () => Promise<FRotator>;
	
    /**
     * @param NewRotation Struct property
     * @param bTeleportPhysics Boolean property
     * @return Boolean property
     * @flags Final, Native, Public, HasDefaults, BlueprintCallable
     */
    @Property.Function( "Function Engine.Actor.K2_SetActorRotation", [ [ () => FRotator ], [], [] ] )
    public K2_SetActorRotation: ( NewRotation: FRotator, bTeleportPhysics: boolean ) => Promise<boolean>;
	
    /**
     * @param NewRelativeRotation Struct property
     * @param bSweep Boolean property
     * @param SweepHitResult Struct property
     * @param bTeleport Boolean property
     * @flags Final, Native, Public, HasOutParms, HasDefaults, BlueprintCallable
     */
    @Property.Function( "Function Engine.Actor.K2_SetActorRelativeRotation", [ [ () => FRotator ], [], [ () => FHitResult ], [] ] )
    public K2_SetActorRelativeRotation: ( NewRelativeRotation: FRotator, bSweep: boolean, SweepHitResult: InOutParam<FHitResult>, bTeleport: boolean ) => Promise<void>;
	
	/**
     * @param NewLocation Struct property
     * @param NewRotation Struct property
     * @param bSweep Boolean property
     * @param SweepHitResult Struct property
     * @param bTeleport Boolean property
     * @return Boolean property
     * @flags Final, Native, Public, HasOutParms, HasDefaults, BlueprintCallable
     */
    @Property.Function( "Function Engine.Actor.K2_SetActorLocationAndRotation", [ [ () => FVector ], [ () => FRotator ], [], [ () => FHitResult ], [], [] ] )
    public K2_SetActorLocationAndRotation: ( NewLocation: FVector, NewRotation: FRotator, bSweep: boolean, SweepHitResult: InOutParam<FHitResult>, bTeleport: boolean ) => Promise<boolean>;
	
}