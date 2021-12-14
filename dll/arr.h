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
	
	void SetWhistle(float Value); // Function arr.framecar.SetWhistle // (Final|Native|Public|BlueprintCallable) // @ game+0xab9c80
};

// Class Engine.BlueprintFunctionLibrary
// Size: 0x28 (Inherited: 0x28)
struct UBlueprintFunctionLibrary : UObject {
};

// Class arr.SCharacter
// Size: 0xbb0 (Inherited: 0x4c0)
struct ASCharacter : ACharacter {
	char pad_4C0[0x6F0]; // 0x4c0(0x6F0)

	void ServerSwitchUp(struct ASwitch* MySwitch); // Function arr.SCharacter.ServerSwitchUp // (Net|Native|Event|Protected|NetServer) // @ game+0xac36f0
	void ServerSwitchDown(struct ASwitch* MySwitch); // Function arr.SCharacter.ServerSwitchDown // (Net|Native|Event|Protected|NetServer) // @ game+0xac3660
	void ServerSetRaycastReverser(struct Ajohnsonbar* reverser, float Value); // Function arr.SCharacter.ServerSetRaycastReverser // (Net|Native|Event|Protected|NetServer) // @ game+0xac2770
	void ServerSetRaycastRegulator(struct Aregulator* regulator, float Value); // Function arr.SCharacter.ServerSetRaycastRegulator // (Net|Native|Event|Protected|NetServer) // @ game+0xac26a0
	void ServerSetRaycastBake(struct Aairbrake* Brake, float Value); // Function arr.SCharacter.ServerSetRaycastBake // (Net|Native|Event|Protected|NetServer) // @ game+0xac2320
	void ServerSetRaycastWhistle(struct Awhistle* whistle, float Input); // Function arr.SCharacter.ServerSetRaycastWhistle // (Net|Native|Event|Protected|NetServer) // @ game+0xac2840
	void ServerSetRaycastHandvalve(struct Ahandvalve* handvalve, float Value); // Function arr.SCharacter.ServerSetRaycastHandvalve // (Net|Native|Event|Protected|NetServer) // @ game+0xac25d0
};

// Class Engine.KismetSystemLibrary
// Size: 0x28 (Inherited: 0x28)
struct UKismetSystemLibrary : UBlueprintFunctionLibrary {
	bool IsServer(struct UObject* WorldContextObject); // Function Engine.KismetSystemLibrary.IsServer // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597b20
	bool IsLoggedIn(struct APlayerController* SpecificPlayer); // Function Engine.KismetSystemLibrary.IsLoggedIn // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597940
};

// Class arr.johnsonbar
// Size: 0x2c0 (Inherited: 0x220)
struct Ajohnsonbar : AActor {
	char pad_220[0xA0]; // 0x220(0xA0)
};

// Class arr.regulator
// Size: 0x290 (Inherited: 0x220)
struct Aregulator : AActor {
	char pad_220[0x70]; // 0x220(0x70)
};

// Class arr.airbrake
// Size: 0x270 (Inherited: 0x220)
struct Aairbrake : AActor {
	char pad_220[0x50]; // 0x220(0x50)
};

// Class arr.whistle
// Size: 0x2c0 (Inherited: 0x220)
struct Awhistle : AActor {
	char pad_220[0xA0]; // 0x220(0xA0)
};

// Class arr.handvalve
// Size: 0x248 (Inherited: 0x220)
struct Ahandvalve : AActor {
	char pad_220[0x28]; // 0x220(0x28)
};