#pragma once
#include "engine.h"

// Class arr.arrGameModeBase
// Size: 0x5d0 (Inherited: 0x2c0)
struct AarrGameModeBase : AGameModeBase {
  char pad_2C0[0x310]; // 0x2C0(0x310)

  void SaveGame(struct FString MySaveSlotName); // Function arr.arrGameModeBase.SaveGame // (Final|Native|Private|BlueprintCallable) // @ game+0xab02c0
};

// Class arr.Switch
// Size: 0x2b8 (Inherited: 0x220)
struct ASwitch : AActor {
	char pad_220[0x50]; //0x220(0x50)
	int32_t switchstate; // 0x270(0x04)
	char pad_274[0x44]; // 0x274(0x44)

	void SetSwitchState(int32_t State); // Function arr.Switch.SetSwitchState // (Final|Native|Public) // @ game+0xac84c0
};

// Class arr.framecar
// Size: 0xbf0 (Inherited: 0x4c0)
struct Aframecar : ACharacter {
	char pad_4C0[0x730]; //0x4C0(0x730)

	void SetReverserValue(float Value); // Function arr.framecar.SetReverserValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab9b00
	void SetRegulatorValue(float Value); // Function arr.framecar.SetRegulatorValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab9a80
	void SetBrakeValue(float Value); // Function arr.framecar.SetBrakeValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab9260
};

// Class Engine.BlueprintFunctionLibrary
// Size: 0x28 (Inherited: 0x28)
struct UBlueprintFunctionLibrary : UObject {
};

// Class Engine.KismetSystemLibrary
// Size: 0x28 (Inherited: 0x28)
struct UKismetSystemLibrary : UBlueprintFunctionLibrary {
	bool IsServer(struct UObject* WorldContextObject); // Function Engine.KismetSystemLibrary.IsServer // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597b20
	bool IsLoggedIn(struct APlayerController* SpecificPlayer); // Function Engine.KismetSystemLibrary.IsLoggedIn // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597940
};