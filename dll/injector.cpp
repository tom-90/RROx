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

void setEngineControls(int type, uint64_t addrCharacter, uint64_t addrControl, uint64_t addrFramecar, float value)
{
    ASCharacter* ch = (ASCharacter*)addrCharacter;
    Aframecar* frame = (Aframecar*)addrFramecar;

    if( type == 1 )
        ch->ServerSetRaycastRegulator((Aregulator*)addrControl, value);
    else if( type == 2 )
        ch->ServerSetRaycastReverser((Ajohnsonbar*)addrControl, value);
    else if( type == 3 )
        ch->ServerSetRaycastBake((Aairbrake*)addrControl, value);
    else if( type == 4 ) {
        frame->SetWhistle(value);
        ch->ServerSetRaycastWhistle((Awhistle*)addrControl, value);
    }
    else if( type == 5 || type == 6 )
        ch->ServerSetRaycastHandvalve((Ahandvalve*)addrControl, value);
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