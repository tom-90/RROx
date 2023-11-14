import * as MainStructs from './main-UE4';
import * as BetaStructs from './beta-UE5';

export namespace Structs {
    export type UWorld = MainStructs.Engine.UWorld | BetaStructs.Engine.UWorld;
    export type UGameEngine = MainStructs.Engine.UGameEngine | BetaStructs.Engine.UGameEngine;
    export type UKismetSystemLibrary = MainStructs.Engine.UKismetSystemLibrary | BetaStructs.Engine.UKismetSystemLibrary;
    export type UNetConnection = MainStructs.Engine.UNetConnection | BetaStructs.Engine.UNetConnection;
    export type UActorChannel = MainStructs.Engine.UActorChannel | BetaStructs.Engine.UActorChannel;
    export type APlayerState = MainStructs.Engine.APlayerState | BetaStructs.Engine.APlayerState;
    export type ABPPlayerConductorC = MainStructs.BP_Player_Conductor.ABP_Player_Conductor_C | BetaStructs.BP_Player_Conductor.ABP_Player_Conductor_C;
    export type AActor = MainStructs.Engine.AActor | BetaStructs.Engine.AActor;
    export type Aframecar = MainStructs.arr.Aframecar | BetaStructs.arr.Aframecar;
    export type ASwitch = MainStructs.arr.ASwitch | BetaStructs.arr.ASwitch;
    export type Aturntable = MainStructs.arr.Aturntable | BetaStructs.arr.Aturntable;
    export type Awatertower = MainStructs.arr.Awatertower | BetaStructs.arr.Awatertower;
    export type Asandhouse = MainStructs.arr.Asandhouse | BetaStructs.arr.Asandhouse;
    export type Aindustry = MainStructs.arr.Aindustry | BetaStructs.arr.Aindustry;
    export type ASplineActor = MainStructs.arr.ASplineActor | BetaStructs.arr.ASplineActor;
    export type ASplineTrack = MainStructs.arr.ASplineTrack | BetaStructs.arr.ASplineTrack;
    export type AarrGameStateBase = MainStructs.arr.AarrGameStateBase | BetaStructs.arr.AarrGameStateBase;
    export type FVector = MainStructs.CoreUObject.FVector | BetaStructs.CoreUObject.FVector;
    export type FRotator = MainStructs.CoreUObject.FRotator | BetaStructs.CoreUObject.FRotator;
    export type Astorage = MainStructs.arr.Astorage | BetaStructs.arr.Astorage;
    export type Acoupler = MainStructs.arr.Acoupler | BetaStructs.arr.Acoupler;
    export type Acrane = MainStructs.arr.Acrane | BetaStructs.arr.Acrane;
    export type ASCharacter = MainStructs.arr.ASCharacter | BetaStructs.arr.ASCharacter;
    export type APawn = MainStructs.Engine.APawn | BetaStructs.Engine.APawn;
}

export interface IWorldObjects {
    players: Structs.APlayerState[];
    frameCars: Structs.Aframecar[];
    switches: Structs.ASwitch[];
    turntables: Structs.Aturntable[];
    watertowers: Structs.Awatertower[];
    sandhouses: Structs.Asandhouse[];
    industries: Structs.Aindustry[];
    splines: Structs.ASplineActor[];
    splineTracks: Structs.ASplineTrack[];
}