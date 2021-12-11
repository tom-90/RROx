#pragma once
#include <cstdint>

void save(uint64_t addrGameMode, int slotIndex);
void changeSwitch(uint64_t addrGameMode, uint64_t addrCharacter);
void setEngineControls(uint64_t addrCharacter, uint64_t addrBrake, uint64_t addrRegulator, uint64_t addrReverser, float regulator, float reverser, float brake);
bool isServerHost(uint64_t addrKismet, uint64_t addrWorld);
bool isLoggedIn(uint64_t addrKismet, uint64_t addrPlayer);
