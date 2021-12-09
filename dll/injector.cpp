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

void changeSwitch(uint64_t addrSwitch)
{
    ASwitch* sw = (ASwitch*)addrSwitch;

    if (sw->switchstate == 0)
        sw->SetSwitchState(1);
    else if (sw->switchstate == 1)
        sw->SetSwitchState(0);
}

void setEngineControls(uint64_t addrFramecar, float regulator, float reverser, float brake)
{
    Aframecar* frame = (Aframecar*)addrFramecar;

    frame->SetBrakeValue(brake);
    frame->SetRegulatorValue(regulator);
    frame->SetReverserValue(reverser);
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