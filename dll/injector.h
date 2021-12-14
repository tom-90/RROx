#pragma once
#include <cstdint>

void save(uint64_t addrGameMode, int slotIndex);
void changeSwitch(uint64_t addrGameMode, uint64_t addrCharacter);
void setEngineControls(int type, uint64_t addrCharacter, uint64_t addrControl, uint64_t addrFramecar, float value);
bool isServerHost(uint64_t addrKismet, uint64_t addrWorld);
bool isLoggedIn(uint64_t addrKismet, uint64_t addrPlayer);
