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

void ASwitch::SetSwitchState(int32_t State)
{
    static auto fn = ObjObjects->FindObject("Function arr.Switch.SetSwitchState");
    struct {
        int32_t State;
    } parms;
    parms = { State };
    ProcessEvent(fn, &parms);
}

void Aframecar::SetReverserValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.SetReverserValue");
    struct {
        float value;
    } parms;
    parms = { value };
    ProcessEvent(fn, &parms);
}

void Aframecar::SetRegulatorValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.SetRegulatorValue");
    struct {
        float value;
    } parms;
    parms = { value };
    ProcessEvent(fn, &parms);
}

void Aframecar::SetBrakeValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.SetBrakeValue");
    struct {
        float value;
    } parms;
    parms = { value };
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