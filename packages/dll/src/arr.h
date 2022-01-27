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
	char pad_4C0[0x18]; // 0x4c0(0x18)
	struct FString myplayername; // 0x4d8(0x10)
	char pad_4E8[0x6C8]; // 0x4c0(0x6C8)

	void ServerSwitchUp(struct ASwitch* MySwitch); // Function arr.SCharacter.ServerSwitchUp // (Net|Native|Event|Protected|NetServer) // @ game+0xac36f0
	void ServerSwitchDown(struct ASwitch* MySwitch); // Function arr.SCharacter.ServerSwitchDown // (Net|Native|Event|Protected|NetServer) // @ game+0xac3660
	void ServerSetRaycastReverser(struct Ajohnsonbar* reverser, float Value); // Function arr.SCharacter.ServerSetRaycastReverser // (Net|Native|Event|Protected|NetServer) // @ game+0xac2770
	void ServerSetRaycastRegulator(struct Aregulator* regulator, float Value); // Function arr.SCharacter.ServerSetRaycastRegulator // (Net|Native|Event|Protected|NetServer) // @ game+0xac26a0
	void ServerSetRaycastBake(struct Aairbrake* Brake, float Value); // Function arr.SCharacter.ServerSetRaycastBake // (Net|Native|Event|Protected|NetServer) // @ game+0xac2320
	void ServerSetRaycastWhistle(struct Awhistle* whistle, float Input); // Function arr.SCharacter.ServerSetRaycastWhistle // (Net|Native|Event|Protected|NetServer) // @ game+0xac2840
	void ServerSetRaycastHandvalve(struct Ahandvalve* handvalve, float Value); // Function arr.SCharacter.ServerSetRaycastHandvalve // (Net|Native|Event|Protected|NetServer) // @ game+0xac25d0
	void ServerSpawnSpline(struct FVector Pos, struct FRotator Rot, struct TArray<struct FVector> ControlPoints, char SplineType); // Function arr.SCharacter.ServerSpawnSpline // (Net|NetReliableNative|Event|Protected|NetServer|HasDefaults|NetValidate) // @ game+0xac8790

	void ChangePlayerXP(int32_t xpadd); // Function arr.SCharacter.ChangePlayerXP // (Final|Native|Public|BlueprintCallable) // @ game+0xac5d40
	void ChangePlayerMoney(float deltamoney); // Function arr.SCharacter.ChangePlayerMoney // (Final|Native|Public|BlueprintCallable) // @ game+0xac5cc0
};

// Enum Engine.EDrawDebugTrace
enum class EDrawDebugTrace : uint8_t {
	None = 0,
	ForOneFrame = 1,
	ForDuration = 2,
	Persistent = 3,
	EDrawDebugTrace_MAX = 4
};

// Enum Engine.ETraceTypeQuery
enum class ETraceTypeQuery : uint8_t {
	TraceTypeQuery1 = 0,
	TraceTypeQuery2 = 1,
	TraceTypeQuery3 = 2,
	TraceTypeQuery4 = 3,
	TraceTypeQuery5 = 4,
	TraceTypeQuery6 = 5,
	TraceTypeQuery7 = 6,
	TraceTypeQuery8 = 7,
	TraceTypeQuery9 = 8,
	TraceTypeQuery10 = 9,
	TraceTypeQuery11 = 10,
	TraceTypeQuery12 = 11,
	TraceTypeQuery13 = 12,
	TraceTypeQuery14 = 13,
	TraceTypeQuery15 = 14,
	TraceTypeQuery16 = 15,
	TraceTypeQuery17 = 16,
	TraceTypeQuery18 = 17,
	TraceTypeQuery19 = 18,
	TraceTypeQuery20 = 19,
	TraceTypeQuery21 = 20,
	TraceTypeQuery22 = 21,
	TraceTypeQuery23 = 22,
	TraceTypeQuery24 = 23,
	TraceTypeQuery25 = 24,
	TraceTypeQuery26 = 25,
	TraceTypeQuery27 = 26,
	TraceTypeQuery28 = 27,
	TraceTypeQuery29 = 28,
	TraceTypeQuery30 = 29,
	TraceTypeQuery31 = 30,
	TraceTypeQuery32 = 31,
	TraceTypeQuery_MAX = 32,
	ETraceTypeQuery_MAX = 33
};

// Class Engine.KismetSystemLibrary
// Size: 0x28 (Inherited: 0x28)
struct UKismetSystemLibrary : UBlueprintFunctionLibrary {
	bool IsServer(struct UObject* WorldContextObject); // Function Engine.KismetSystemLibrary.IsServer // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597b20
	bool IsLoggedIn(struct APlayerController* SpecificPlayer); // Function Engine.KismetSystemLibrary.IsLoggedIn // (Final|Native|Static|Public|BlueprintCallable|BlueprintPure) // @ game+0x2597940

	bool LineTraceSingle(struct UObject* WorldContextObject, struct FVector Start, struct FVector End, enum class ETraceTypeQuery TraceChannel, bool bTraceComplex, struct TArray<struct AActor*>& ActorsToIgnore, enum class EDrawDebugTrace DrawDebugType, struct FHitResult& OutHit, bool bIgnoreSelf, struct FLinearColor TraceColor, struct FLinearColor TraceHitColor, float DrawTime); // Function Engine.KismetSystemLibrary.LineTraceSingle // (Final|Native|Static|Public|HasOutParms|HasDefaults|BlueprintCallable) // @ game+0x259a420
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

// Class arr.SplineActor
// Size: 0x6c8 (Inherited: 0x220)
struct ASplineActor : AActor {
	char pad_220[0x8]; // 0x220(0x8)

	struct FVector PosNewSplinePoint; // 0x228(0x0c)

	char pad_234[0xEC]; // 0x234(0xEC)

	struct TArray<struct FVector_NetQuantize> SplineControlPoints; // 0x320(0x10)

	char pad_330[0x360]; // 0x330(0x360)

	struct TArray<bool> SplineMeshBoolArray; // 0x690(0x10)

	char pad_6A0[0x10]; // 0x6C0(0x10)

	struct TArray<int32_t> IndicesToShowArray; // 0x6b0(0x10)

	char pad_6C0[0x8]; // 0x6C0(0x8)


	void AddNewSplinePoint(struct FVector Position); // Function arr.SplineActor.AddNewSplinePoint // (Final|Native|Public|HasDefaults|BlueprintCallable) // @ game+0xacaa10
	void MoveLastSplinePoint(struct FVector NewPosition); // Function arr.SplineActor.MoveLastSplinePoint // (Final|Native|Public|HasDefaults|BlueprintCallable) // @ game+0xacb230
	void UpdateSpline(); // Function arr.SplineActor.UpdateSpline // (Final|Native|Public|BlueprintCallable) // @ game+0xacb7d0
	void DrawSpline(); // Function arr.SplineActor.DrawSpline // (Final|Native|Public|BlueprintCallable) // @ game+0xacace0

	void DeleteLastSplinePoint(); // Function arr.SplineActor.DeleteLastSplinePoint // (Final|Native|Public|BlueprintCallable) // @ game+0xacac60

	void UpdateSplineVisibility(); // Function arr.SplineActor.UpdateSplineVisibility // (Final|Native|Public|BlueprintCallable) // @ game+0xacb810
	void UpdateSplineCollision(); // Function arr.SplineActor.UpdateSplineCollision // (Final|Native|Public|BlueprintCallable) // @ game+0xacb7f0
};