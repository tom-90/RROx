#include "injector.h"
#include "engine.h"
#include "utils.h"
#include "arr.h"

void save(uint64_t addrGameMode, int slotIndex)
{
  AarrGameModeBase* mode = (AarrGameModeBase*)addrGameMode;

  std::wstring wstring = std::wstring(L"slot") + std::to_wstring(slotIndex);
  wchar_t* str = const_cast<wchar_t*>(wstring.c_str());

  FString slot{
    str,
    wcslen(str) + 1,
    16
  };

  mode->SaveGame(slot);
}

void changeSwitch(uint64_t addrSwitch, uint64_t addrCharacter)
{
    ASwitch* sw = (ASwitch*)addrSwitch;
    ASCharacter* ch = (ASCharacter*)addrCharacter;

    if (sw->switchstate == 0)
        ch->ServerSwitchUp(sw);
    else if (sw->switchstate == 1)
        ch->ServerSwitchDown(sw);
}

void setEngineControls(uint64_t addrCharacter, uint64_t addrBrake, uint64_t addrRegulator, uint64_t addrReverser, float regulator, float reverser, float brake)
{
    ASCharacter* ch = (ASCharacter*)addrCharacter;

    //frame->SetBrakeValue(brake);
    //frame->SetRegulatorValue(regulator);
    //frame->SetReverserValue(reverser);

    //frame->ServerSetBrake(frame, brake);
    //frame->ServerSetRegulator(frame, regulator);
    //frame->ServerSetReverser(frame, reverser);

    ch->ServerSetRaycastBake((Aairbrake*)addrBrake, brake);
    ch->ServerSetRaycastReverser((Ajohnsonbar*)addrReverser, reverser);
    ch->ServerSetRaycastRegulator((Aregulator*)addrRegulator, regulator);
}

bool isServerHost(uint64_t addrKismet, uint64_t addrWorld)
{
    UKismetSystemLibrary* kismet = (UKismetSystemLibrary*)addrKismet;
    UWorld* world = (UWorld*)addrWorld;

    return kismet->IsServer(world);
}

bool isLoggedIn(uint64_t addrKismet, uint64_t addrPlayer)
{
    UKismetSystemLibrary* kismet = (UKismetSystemLibrary*)addrKismet;
    APlayerController* player = (APlayerController*)addrPlayer;

    return kismet->IsLoggedIn(player);
}