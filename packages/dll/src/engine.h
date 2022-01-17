#pragma once
#include <cstdint>
#include <windows.h>
#include <string>
#undef DrawText

struct FVector {
  float X, Y, Z;

  FVector() : X(0.f), Y(0.f), Z(0.f) {}
  FVector(float X, float Y, float Z) : X(X), Y(Y), Z(Z) {}
  FVector(float InF) : X(InF), Y(InF), Z(InF) { }
  float Size() const { return sqrtf(X * X + Y * Y + Z * Z); }
  float DistTo(const FVector& V) const { return (*this - V).Size(); }
  FVector operator-(const FVector& other) const { return FVector(X - other.X, Y - other.Y, Z - other.Z); }
};

// ScriptStruct Engine.Vector_NetQuantize
// Size: 0x0c (Inherited: 0x0c)
struct FVector_NetQuantize : FVector {
	FVector_NetQuantize() : FVector() {}
	FVector_NetQuantize(float X, float Y, float Z) : FVector(X,Y,Z) {}
	FVector_NetQuantize(float InF) : FVector(InF) { }
};

// ScriptStruct Engine.Vector_NetQuantizeNormal
// Size: 0x0c (Inherited: 0x0c)
struct FVector_NetQuantizeNormal : FVector {
};

struct FVector2D {
  float X, Y;
};

struct FRotator {
  float Pitch, Yaw, Roll;

  FRotator() : Pitch(0.f), Yaw(0.f), Roll(0.f) {}
  FRotator(float Pitch, float Yaw, float Roll) : Pitch(Pitch), Yaw(Yaw), Roll(Roll) {}
  FRotator(float InF) : Pitch(InF), Yaw(InF), Roll(InF) { }
};

struct FLinearColor {
  float R, G, B, A;
  FLinearColor() : R(0.f), G(0.f), B(0.f), A(0.f) {};
  FLinearColor(float R, float G, float B, float A) : R(R), G(G), B(B), A(A) {};
};

template<typename T>
struct TArray {
  T* Data;
  int Count;
  int Size;
};

struct FString : TArray<wchar_t> {};

struct FNameEntryHandle {
  uint32_t Block = 0;
  uint32_t Offset = 0;

  FNameEntryHandle(uint32_t block, uint32_t offset) : Block(block), Offset(offset) {};
  FNameEntryHandle(uint32_t id) : Block(id >> 16), Offset(id & 65535) {};
  operator uint32_t() const { return (Block << 16 | Offset); }
};

struct FNameEntry {
  uint16_t bIsWide : 1;
  uint16_t LowercaseProbeHash : 5;
  uint16_t Len : 10;
  union
  {
    char AnsiName[1024];
    wchar_t	WideName[1024];
  };

  std::string String();
};

struct FNamePool
{
  byte Lock[8];
  uint32_t CurrentBlock;
  uint32_t CurrentByteCursor;
  byte* Blocks[8192];

  FNameEntry* GetEntry(FNameEntryHandle handle) const;
};

struct FName {
  uint32_t Index;
  uint32_t Number;

  std::string GetName();
};

struct UObject {
  void** VFTable;
  uint32_t ObjectFlags;
  uint32_t InternalIndex;
  struct UClass* ClassPrivate;
  FName NamePrivate;
  UObject* OuterPrivate;

  std::string GetName();
  std::string GetFullName();
  bool IsA(void* cmp);
  void ProcessEvent(void* fn, void* parms);
};


// Class CoreUObject.Field
// Size: 0x30 (Inherited: 0x28)
struct UField : UObject {
  char UnknownData_28[0x8]; // 0x28(0x08)
};

// Class CoreUObject.Struct
// Size: 0xb0 (Inherited: 0x30)
struct UStruct : UField {
  char UnknownData_30[0x10]; // 0x30(0x10)
  UStruct* SuperStruct; // 0x40(0x8)
  char UnknownData_48[0x68]; // 0x48(0x80)
};

// Class CoreUObject.Class
// Size: 0x230 (Inherited: 0xb0)
struct UClass : UStruct {
  char UnknownData_B0[0x180]; // 0xb0(0x180)
};

struct TUObjectArray {
  byte** Objects;
  byte* PreAllocatedObjects;
  uint32_t MaxElements;
  uint32_t NumElements;
  uint32_t MaxChunks;
  uint32_t NumChunks;

  UObject* GetObjectPtr(uint32_t id) const;
  UObject* FindObject(const char* name) const;
};

// Class Engine.Canvas
// Size: 0x2c0 (Inherited: 0x28)
struct UCanvas : UObject {
  void K2_DrawText(void* RenderFont, FString& RenderText, FVector2D& ScreenPosition, FVector2D& Scale, FLinearColor& RenderColor, float Kerning, FLinearColor& ShadowColor, FVector2D& ShadowOffset, bool bCentreX, bool bCentreY, bool bOutlined, FLinearColor& OutlineColor); // Function Engine.Canvas.K2_DrawText
};

// Class Engine.Actor
// Size: 0x220 (Inherited: 0x28)
struct AActor : UObject {
  char pad_28[0x1F8]; // 0x28(0x1F8)

  FVector K2_GetActorLocation();
  bool K2_SetActorLocation(struct FVector NewLocation, bool bSweep, struct FHitResult& SweepHitResult, bool bTeleport); // Function Engine.Actor.K2_SetActorLocation // (Final|Native|Public|HasOutParms|HasDefaults|BlueprintCallable) // @ game+0x24cf750
};

// Class Engine.Pawn
// Size: 0x280 (Inherited: 0x220)
struct APawn : AActor {
  char pad_220[0x60];
};

// Class Engine.PlayerCameraManager
// Size: 0x2740 (Inherited: 0x220)
struct APlayerCameraManager : AActor {
  char pad_220[0x2520]; // 0x220
};

// Class Engine.Controller
// Size: 0x298 (Inherited: 0x220)
struct AController : AActor {
  char pad_220[0x78];

  struct APawn* K2_GetPawn();
};

// ScriptStruct Engine.HitResult
// Size: 0x88 (Inherited: 0x00)
struct FHitResult {
	char bBlockingHit : 1; // 0x00(0x01)
	char bStartPenetrating : 1; // 0x00(0x01)
	char pad_0_2 : 6; // 0x00(0x01)
	char pad_1[0x3]; // 0x01(0x03)
	int32_t FaceIndex; // 0x04(0x04)
	float Time; // 0x08(0x04)
	float Distance; // 0x0c(0x04)
	struct FVector_NetQuantize Location; // 0x10(0x0c)
	struct FVector_NetQuantize ImpactPoint; // 0x1c(0x0c)
	struct FVector_NetQuantizeNormal Normal; // 0x28(0x0c)
	struct FVector_NetQuantizeNormal ImpactNormal; // 0x34(0x0c)
	struct FVector_NetQuantize TraceStart; // 0x40(0x0c)
	struct FVector_NetQuantize TraceEnd; // 0x4c(0x0c)
	float PenetrationDepth; // 0x58(0x04)
	int32_t Item; // 0x5c(0x04)
	char pad_60[0x8]; // 0x60(0x03)
	char pad_68[0x8]; // 0x68(0x03)
	char pad_70[0x8]; // 0x70(0x03)
	struct FName BoneName; // 0x78(0x08)
	struct FName MyBoneName; // 0x80(0x08)
};

// Class Engine.PlayerController
// Size: 0x570 (Inherited: 0x298)
struct APlayerController : AController {
  char pad_298[0x20]; // 0x298(0x08)
  struct APlayerCameraManager* PlayerCameraManager; // 0x2b8(0x08)15B1DA64D80

  bool ProjectWorldLocationToScreen(struct FVector& WorldLocation, struct FVector2D& ScreenLocation, bool bPlayerViewportRelative); // Function Engine.PlayerController.ProjectWorldLocationToScreen
  void ServerPause(); // Function Engine.PlayerController.ServerPause // (Net|NetReliableNative|Event|Public|NetServer|NetValidate) // @ game+0x25eeab0
};

// Class Engine.Player
// Size: 0x48 (Inherited: 0x28)
struct UPlayer : UObject {
  char UnknownData_28[0x8]; // 0x28(0x08)
  struct APlayerController* PlayerController; // 0x30(0x08)
};

// Class Engine.PlayerState
// Size: 0x320 (Inherited: 0x220)
struct APlayerState : AActor {
  char pad_220[0x60]; // 0x220(0x04)
  struct APawn* PawnPrivate; // 0x280(0x08)
  char pad_288[0x78]; // 0x288
  struct FString PlayerNamePrivate; // 0x300(0x10)
};

// Class Engine.GameStateBase
// Size: 0x270 (Inherited: 0x220)
struct AGameStateBase : AActor {
  char pad_220[0x18]; // 0x220
  struct TArray<struct APlayerState*> PlayerArray; // 0x238(0x10)
  char pad_248[0x28]; // 0x248
};

// Class Engine.GameModeBase
// Size: 0x2c0 (Inherited: 0x220)
struct AGameModeBase : AActor {
  char pad_220[0xA0]; // 0x2a9(0x17)
};

// Class Engine.GameInstance
// Size: 0x198 (Inherited: 0x28)
struct UGameInstance : UObject {
  char UnknownData_28[0x10]; // 0x28(0x10)
  struct TArray<struct UPlayer*> LocalPlayers; // 0x38(0x10)
};

// Class Engine.World
// Size: 0x710 (Inherited: 0x28)
struct UWorld : UObject {
  char pad_28[0x108]; // 0x28(0x108)
  struct AGameStateBase* GameState; // 0x130(0x08)
  char pad_0x138[0x50]; // 0x138(0x50)
  struct UGameInstance* OwningGameInstance; // 0x188(0x08)
};

// Class Engine.ScriptViewportClient
// Size: 0x38 (Inherited: 0x28)
struct UScriptViewportClient : UObject {
  char UnknownData_28[0x10]; // 0x28(0x10)
};

// Class Engine.GameViewportClient
// Size: 0x330 (Inherited: 0x38)
struct UGameViewportClient : UScriptViewportClient {
  char UnknownData_38[0x40]; // 0x38(0x08)
  struct UWorld* World; // 0x78(0x08)
  struct UGameInstance* GameInstance; // 0x80(0x08)
  char UnknownData_88[0x2a8]; // 0x88(0x2a8)
};

// Class Engine.Engine
// Size: 0xde0 (Inherited: 0x28)
struct UEngine : UObject {
  char UnknownData_28[0x88]; // 0x28(0x08)
  struct UFont* SubtitleFont; // 0xb0(0x08)
  char pad_B8[0x6D0]; // 0xb8
  struct UGameViewportClient* GameViewport; // 0x788(0x08)
};

// Class Engine.Character
// Size: 0x4c0 (Inherited: 0x280)
struct ACharacter : APawn {
  char pad_280[0x240]; // 0x280(9x240)
};

extern UEngine** Engine;
extern FNamePool* NamePoolData;
extern TUObjectArray* ObjObjects;

bool EngineInit();
