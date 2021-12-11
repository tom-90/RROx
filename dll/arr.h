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
	void ControlsSetReverserValue(float Value); // Function arr.framecar.ControlsSetReverserValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab83a0
	void ControlsSetRegulatorValue(float Value); // Function arr.framecar.ControlsSetRegulatorValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab8320
	void ControlsSetBrakeValue(float Value); // Function arr.framecar.ControlsSetBrakeValue // (Final|Native|Public|BlueprintCallable) // @ game+0xab8120
	void ServerSetReverser(struct Aframecar* Vehicle, float Value); // Function arr.framecar.ServerSetReverser // (Net|NetReliableNative|Event|Public|NetServer|BlueprintCallable) // @ game+0xab8f40
	void ServerSetRegulator(struct Aframecar* Vehicle, float Value); // Function arr.framecar.ServerSetRegulator // (Net|Native|Event|Public|NetServer|BlueprintCallable) // @ game+0xab8e70
	void ServerSetBrake(struct Aframecar* Vehicle, float Value); // Function arr.framecar.ServerSetBrake // (Net|NetReliableNative|Event|Public|NetServer|BlueprintCallable) // @ game+0xab8aa0
	void ApplyControlsRegulator(); // Function arr.framecar.ApplyControlsRegulator // (Final|Native|Public|BlueprintCallable) // @ game+0xab8060
	void ApplyControlReverser(); // Function arr.framecar.ApplyControlReverser // (Final|Native|Public|BlueprintCallable) // @ game+0xab8000
	void ApplyControlBrake(); // Function arr.framecar.ApplyControlBrake // (Final|Native|Public|BlueprintCallable) // @ game+0xab7f80
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