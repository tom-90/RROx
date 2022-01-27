#pragma once
#include <cstdint>
#include <string>
#include "arr.h"

void save(uint64_t addrGameMode, int slotIndex);
void changeSwitch(uint64_t addrGameMode, uint64_t addrCharacter);
void setEngineControls(int type, uint64_t addrCharacter, uint64_t addrControl, uint64_t addrFramecar, float value);
bool isServerHost(uint64_t addrKismet, uint64_t addrWorld);
bool isLoggedIn(uint64_t addrKismet, uint64_t addrPlayer);
void teleport(uint64_t addrCharacter, float x, float y, float z);
void setMoneyAndXP(uint64_t addrCharacter, float money, int32_t xp);
void spawnSpline(uint64_t addrCharacter, char type, FVector* controlPoints, int length);
float readHeight(uint64_t addrKismet, uint64_t addrWorldObject, AActor** ignoredActors, int ignoredActorsLength, float x, float y);
void addToSpline(uint64_t addrSpline, float x, float y, float z);
void hideLastSplinePoint(uint64_t addrSpline, int index);
void toggleGamePause(uint64_t addrPlayerController);