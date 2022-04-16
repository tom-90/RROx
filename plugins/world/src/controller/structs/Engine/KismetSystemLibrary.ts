import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { FLinearColor } from "../CoreUObject/LinearColor";
import { UObject } from "../CoreUObject/Object";
import { FVector } from "../CoreUObject/Vector";
import { AActor } from "./Actor";
import { EDrawDebugTrace } from "./EDrawDebugTrace";
import { ETraceTypeQuery } from "./ETraceTypeQuery";
import { FHitResult } from "./HitResult";

@Struct( "Class Engine.KismetSystemLibrary" )
export class UKismetSystemLibrary {

    constructor( struct: StructInfo<UKismetSystemLibrary> ) {
        struct.apply( this );
    }

    /**
     * @param WorldContextObject Object property
     * @param Start Struct property
     * @param End Struct property
     * @param TraceChannel Enum property
     * @param bTraceComplex Boolean property
     * @param ActorsToIgnore Array containing: Object property
     * @param DrawDebugType Enum property
     * @param OutHit Struct property
     * @param bIgnoreSelf Boolean property
     * @param TraceColor Struct property
     * @param TraceHitColor Struct property
     * @param DrawTime Float number property
     * @return Boolean property
     * @flags Final, Native, Static, Public, HasOutParms, HasDefaults, BlueprintCallable
     */
    @Property.Function( "Function Engine.KismetSystemLibrary.LineTraceSingle", [ [ () => UObject ], [ () => FVector ], [ () => FVector ], [ () => ETraceTypeQuery ], [], [ [ () => AActor ] ], [ () => EDrawDebugTrace ], [ () => FHitResult ], [], [ () => FLinearColor ], [ () => FLinearColor ], [], [] ] )
    public LineTraceSingle: ( WorldContextObject: UObject, Start: FVector, End: FVector, TraceChannel: ETraceTypeQuery, bTraceComplex: boolean, ActorsToIgnore: InOutParam<Array<AActor>>, DrawDebugType: EDrawDebugTrace, OutHit: InOutParam<FHitResult>, bIgnoreSelf: boolean, TraceColor: FLinearColor, TraceHitColor: FLinearColor, DrawTime: float ) => Promise<boolean>;
    
}