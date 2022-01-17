#include "injector.h"
#include "engine.h"
#include "utils.h"
#include "arr.h"
#include "pipe.h"
#include <fstream>

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

void teleport(uint64_t addrCharacter, float x, float y, float z)
{
    ASCharacter* ch = (ASCharacter*)addrCharacter;

    // This is unused
    FHitResult result = {};

	ch->K2_SetActorLocation(FVector(x,y,z), false, result, true);
}


void setMoneyAndXP(uint64_t addrCharacter, float money, int32_t xp)
{
    ASCharacter* ch = (ASCharacter*)addrCharacter;

    ch->SetPlayerMoney(money);
    ch->SetPlayerXP(xp);
}

void spawnSpline(uint64_t addrCharacter, char type, FVector* controlPoints, int length)
{
    ASCharacter* ch = (ASCharacter*)addrCharacter;

    logger->WriteString("Setting type=");
    logger->WriteString(std::to_string((int)type));
    logger->WriteString("\n");
    for (int i = 0; i < length; i++) {
        logger->WriteString("Setting control point: X=");
        logger->WriteString(std::to_string(controlPoints[i].X));
        logger->WriteString("; Y=");
        logger->WriteString(std::to_string(controlPoints[i].Y));
        logger->WriteString("; Z=");
        logger->WriteString(std::to_string(controlPoints[i].Z));
        logger->WriteString("\n");
    }

    ch->ServerSpawnSpline(controlPoints[0], FRotator(0,0,0), {
        controlPoints,
        length,
        sizeof(FVector)
    }, type);
}

void addToSpline(uint64_t addrSpline, float x, float y, float z)
{
    ASplineActor* spline = (ASplineActor*)addrSpline;

    int count = spline->SplineControlPoints.Count;

    FVector_NetQuantize* controlPoints = new FVector_NetQuantize[count + 1];
    for (int i = 0; i < count; i++) {
        controlPoints[i] = FVector_NetQuantize(spline->SplineControlPoints.Data[i].X, spline->SplineControlPoints.Data[i].Y, spline->SplineControlPoints.Data[i].Z);
    }

    int32_t* indicesToShow = new int32_t[count];
    for (int i = 1; i < count; i++) {
        indicesToShow[i - 1] = i;
    }

    indicesToShow[count - 1] = count;

    controlPoints[count] = FVector_NetQuantize(x, y, z);

    spline->SplineControlPoints = {
        controlPoints,
        count + 1,
        sizeof(FVector_NetQuantize)
    };

    /*spline->IndicesToShowArray = {
        indicesToShow,
        count,
        sizeof(int32_t)
    };*/

    spline->AddNewSplinePoint(FVector(x, y, z));

    spline->UpdateSpline();
    spline->DrawSpline();
}

float readHeight(uint64_t addrKismet, uint64_t addrWorldObject, AActor** ignoredActors, int ignoredActorsLength, float x, float y) {
    UKismetSystemLibrary* kismet = (UKismetSystemLibrary*)addrKismet;
    UObject* obj = (UObject*)addrWorldObject;


    TArray<AActor*> ignoredActorsArray = {
        ignoredActors,
        ignoredActorsLength,
        sizeof(AActor*)
    };
    FHitResult result = {};

    bool hasHit = kismet->LineTraceSingle(obj, FVector(x, y, 50000), FVector(x, y, 0), ETraceTypeQuery::TraceTypeQuery1, false, ignoredActorsArray, EDrawDebugTrace::None, result, false, FLinearColor(), FLinearColor(), 0);
    
    if (!hasHit)
        return 0;

    return result.ImpactPoint.Z;
}

void hideLastSplinePoint(uint64_t addrSpline, int index) {
    ASplineActor* spline = (ASplineActor*)addrSpline;

    spline->SplineMeshBoolArray.Data[index] = false;

    spline->UpdateSpline();
    spline->DrawSpline();
}

void toggleGamePause(uint64_t addrPlayerController) {
    APlayerController* player = (APlayerController*)addrPlayerController;

    player->ServerPause();
}