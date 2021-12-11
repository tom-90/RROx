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

void Aframecar::ServerSetReverser(struct Aframecar* vehicle, float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ServerSetReverser");
    struct {
        struct Aframecar* vehicle;
        float value;
    } parms;
    parms = { vehicle, value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ServerSetRegulator(struct Aframecar* vehicle, float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ServerSetRegulator");
    struct {
        struct Aframecar* vehicle;
        float value;
    } parms;
    parms = { vehicle, value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ServerSetBrake(struct Aframecar* vehicle, float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ServerSetBrake");
    struct {
        struct Aframecar* vehicle;
        float value;
    } parms;
    parms = { vehicle, value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ControlsSetReverserValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ControlsSetReverserValue");
    struct {
        float value;
    } parms;
    parms = { value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ControlsSetRegulatorValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ControlsSetRegulatorValue");
    struct {
        float value;
    } parms;
    parms = { value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ControlsSetBrakeValue(float value)
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ControlsSetBrakeValue");
    struct {
        float value;
    } parms;
    parms = { value };
    ProcessEvent(fn, &parms);
}

void Aframecar::ApplyControlsRegulator()
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ApplyControlsRegulator");
    struct {
    } parms;
    parms = {};
    ProcessEvent(fn, &parms);
}

void Aframecar::ApplyControlReverser()
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ApplyControlReverser");
    struct {
    } parms;
    parms = {};
    ProcessEvent(fn, &parms);
}

void Aframecar::ApplyControlBrake()
{
    static auto fn = ObjObjects->FindObject("Function arr.framecar.ApplyControlBrake");
    struct {
    } parms;
    parms = {};
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