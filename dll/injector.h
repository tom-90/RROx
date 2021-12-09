#pragma once
#include <cstdint>

void save(uint64_t addrGameMode, int slotIndex);
void changeSwitch(uint64_t addrGameMode);
void setEngineControls(uint64_t addrFramecar, float regulator, float reverser, float brake);
bool isServerHost(uint64_t addrKismet, uint64_t addrWorld);
bool isLoggedIn(uint64_t addrKismet, uint64_t addrPlayer);
