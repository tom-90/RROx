#include "arr.h"
#include "engine.h"

void AarrGameModeBase::SaveGame(struct FString MySaveSlotName)
{
  static auto fn = ObjObjects->FindObject("Function arr.arrGameModeBase.SaveGame");
  struct {
    FString MySaveSlotName;
  } parms;
  parms = { MySaveSlotName };
  ProcessEvent(fn, &parms);
}

void Aframecar::SetWhistle(float Value)
{
  static auto fn = ObjObjects->FindObject("Function arr.framecar.SetWhistle");
  struct {
    float Value;
  } parms;
  parms = { Value };
  ProcessEvent(fn, &parms);
}

bool UKismetSystemLibrary::IsServer(struct UObject* WorldContextObject)
{
    static auto fn = ObjObjects->FindObject("Function Engine.KismetSystemLibrary.IsServer");
    struct {
        UObject* WorldContextObject;
        bool ReturnValue;
    } parms;
    parms = { WorldContextObject };
    ProcessEvent(fn, &parms);
    return parms.ReturnValue;
}

bool UKismetSystemLibrary::IsLoggedIn(struct APlayerController* SpecificPlayer)
{
    static auto fn = ObjObjects->FindObject("Function Engine.KismetSystemLibrary.IsLoggedIn");
    struct {
        APlayerController* SpecificPlayer;
        bool ReturnValue;
    } parms;
    parms = { SpecificPlayer };
    ProcessEvent(fn, &parms);
    return parms.ReturnValue;
}

bool UKismetSystemLibrary::LineTraceSingle(struct UObject* WorldContextObject, struct FVector Start, struct FVector End, enum class ETraceTypeQuery TraceChannel, bool bTraceComplex, struct TArray<struct AActor*>& ActorsToIgnore, enum class EDrawDebugTrace DrawDebugType,
    struct FHitResult& OutHit, bool bIgnoreSelf, struct FLinearColor TraceColor, struct FLinearColor TraceHitColor, float DrawTime)
{
    static auto fn = ObjObjects->FindObject("Function Engine.KismetSystemLibrary.LineTraceSingle");
    struct {
        UObject* WorldContextObject;
        FVector Start;
        FVector End;
        enum class ETraceTypeQuery TraceChannel;
        bool bTraceComplex;
        struct TArray<struct AActor*> ActorsToIgnore;
        enum class EDrawDebugTrace DrawDebugType;
        struct FHitResult OutHit;
        bool bIgnoreSelf;
        struct FLinearColor TraceColor;
        struct FLinearColor TraceHitColor;
        float DrawTime;
        bool ReturnValue;
    } parms;
    parms = { WorldContextObject, Start, End, TraceChannel, bTraceComplex, ActorsToIgnore, DrawDebugType, OutHit, bIgnoreSelf, TraceColor, TraceHitColor };
    ProcessEvent(fn, &parms);
    OutHit = parms.OutHit;
    return parms.ReturnValue;
}


void ASCharacter::ServerSwitchUp(struct ASwitch* mySwitch) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSwitchUp");
    struct {
        struct ASwitch* mySwitch;
    } parms;
    parms = { mySwitch };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSwitchDown(struct ASwitch* mySwitch) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSwitchDown");
    struct {
        struct ASwitch* mySwitch;
    } parms;
    parms = { mySwitch };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSetRaycastReverser(struct Ajohnsonbar* reverser, float value) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSetRaycastReverser");
    struct {
        struct Ajohnsonbar* reverser;
        float value;
    } parms;
    parms = { reverser, value };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSetRaycastRegulator(struct Aregulator* regulator, float value) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSetRaycastRegulator");
    struct {
        struct Aregulator* regulator;
        float value;
    } parms;
    parms = { regulator, value };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSetRaycastBake(struct Aairbrake* brake, float value) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSetRaycastBake");
    struct {
        struct Aairbrake* brake;
        float value;
    } parms;
    parms = { brake, value };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSetRaycastWhistle(struct Awhistle* whistle, float value) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSetRaycastWhistle");
    struct {
        struct Awhistle* whistle;
        float value;
    } parms;
    parms = { whistle, value };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSetRaycastHandvalve(struct Ahandvalve* handvalve, float value) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSetRaycastHandvalve");
    struct {
        struct Ahandvalve* handvalve;
        float value;
    } parms;
    parms = { handvalve, value };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ChangePlayerXP(int32_t xpadd) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ChangePlayerXP");
    struct {
        int32_t xpadd;
    } parms;
    parms = { xpadd };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ChangePlayerMoney(float deltamoney) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ChangePlayerMoney");
    struct {
        float deltamoney;
    } parms;
    parms = { deltamoney };
    ProcessEvent(fn, &parms);
}

void ASCharacter::ServerSpawnSpline(struct FVector Pos, struct FRotator Rot, struct TArray<struct FVector> ControlPoints, char SplineType) {
    static auto fn = ObjObjects->FindObject("Function arr.SCharacter.ServerSpawnSpline");
    struct {
        FVector Pos;
        FRotator Rot;
        TArray<struct FVector> ControlPoints;
        char SplineType;
    } parms;
    parms = { Pos, Rot, ControlPoints, SplineType };
    ProcessEvent(fn, &parms);
}

void ASplineActor::AddNewSplinePoint(struct FVector Position) {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.AddNewSplinePoint");
    struct {
        FVector Position;
    } parms;
    parms = { Position };
    ProcessEvent(fn, &parms);
}

void ASplineActor::MoveLastSplinePoint(struct FVector NewPosition) {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.MoveLastSplinePoint");
    struct {
        FVector NewPosition;
    } parms;
    parms = { NewPosition };
    ProcessEvent(fn, &parms);
}

void ASplineActor::UpdateSpline() {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.UpdateSpline");
    struct {} parms;
    parms = {};
    ProcessEvent(fn, &parms);
}


void ASplineActor::DrawSpline() {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.DrawSpline");
    struct {} parms;
    parms = {};
    ProcessEvent(fn, &parms);
}

void ASplineActor::DeleteLastSplinePoint() {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.DeleteLastSplinePoint");
    struct {} parms;
    parms = {};
    ProcessEvent(fn, &parms);
}

void ASplineActor::UpdateSplineVisibility() {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.UpdateSplineVisibility");
    struct {} parms;
    parms = {};
    ProcessEvent(fn, &parms);
}

void ASplineActor::UpdateSplineCollision() {
    static auto fn = ObjObjects->FindObject("Function arr.SplineActor.UpdateSplineCollision");
    struct {} parms;
    parms = {};
    ProcessEvent(fn, &parms);
}
