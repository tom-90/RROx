#pragma once
#include "../base.h"
#include <cstdint>
#include <string>
#include "fname.h"
#include "fproperty.h"
#include "ffield.h"

namespace UE503 {
struct FField;

/**
 * Flags describing an object instance
 */
enum class EObjectFlags : uint32_t
{
	RF_NoFlags = 0x00000000,
	RF_Public = 0x00000001,
	RF_Standalone = 0x00000002,
	RF_MarkAsNative = 0x00000004,
	RF_Transactional = 0x00000008,
	RF_ClassDefaultObject = 0x00000010,
	RF_ArchetypeObject = 0x00000020,
	RF_Transient = 0x00000040,
	RF_MarkAsRootSet = 0x00000080,
	RF_TagGarbageTemp = 0x00000100,
	RF_NeedInitialization = 0x00000200,
	RF_NeedLoad = 0x00000400,
	RF_KeepForCooker = 0x00000800,
	RF_NeedPostLoad = 0x00001000,
	RF_NeedPostLoadSubobjects = 0x00002000,
	RF_NewerVersionExists = 0x00004000,
	RF_BeginDestroyed = 0x00008000,
	RF_FinishDestroyed = 0x00010000,
	RF_BeingRegenerated = 0x00020000,
	RF_DefaultSubObject = 0x00040000,
	RF_WasLoaded = 0x00080000,
	RF_TextExportTransient = 0x00100000,
	RF_LoadCompleted = 0x00200000,
	RF_InheritableComponentTemplate = 0x00400000,
	RF_DuplicateTransient = 0x00800000,
	RF_StrongRefOnFrame = 0x01000000,
	RF_NonPIEDuplicateTransient = 0x02000000,
	RF_Dynamic = 0x04000000,
	RF_WillBeLoaded = 0x08000000,
	RF_HasExternalPackage = 0x10000000,
};

inline EObjectFlags operator|(EObjectFlags a, EObjectFlags b)
{
	return static_cast<EObjectFlags>(static_cast<uint32_t>(a) | static_cast<uint32_t>(b));
}

inline EObjectFlags operator&(EObjectFlags a, EObjectFlags b)
{
	return static_cast<EObjectFlags>(static_cast<uint32_t>(a) & static_cast<uint32_t>(b));
}

extern int UObjectProcessEventOffset;

struct UObject {
	void** VFTable; // 0x00(0x08)
	EObjectFlags ObjectFlags; // 0x08(0x03)
	uint32_t InternalIndex; // 0x0C(0x04)
	struct UClass* ClassPrivate; // 0x10(0x08)
	FName NamePrivate; // 0x18(0x08)
	UObject* OuterPrivate; // 0x20(0x08)

	std::string GetName();
	std::string GetFullName();
	
	void ProcessEvent(UFunction* fn, void* parms);
	using FunctionType = UFunction*;
};

// Class CoreUObject.Field
// Size: 0x30 (Inherited: 0x28)
struct UField : UObject {
	/** Next Field in the linked list */
	UField* Next;
};

// Class CoreUObject.Struct
// Size: 0xb0 (Inherited: 0x30)
struct UStruct : UField {
	char UnknownData_30[0x10]; // 0x30(0x10)
	UStruct* SuperStruct; // 0x40(0x8)

	/** Pointer to start of linked list of child fields */
	UField* Children;

	/** Pointer to start of linked list of child fields */
	FField* ChildProperties;

	/** Total size of all UProperties, the allocated structure may be larger due to alignment */
	int32_t PropertiesSize;

	char UnknownData_5C[0x54]; // 0x5C(0x54)
};

// Class CoreUObject.Class
// Size: 0x230 (Inherited: 0xb0)
struct UClass : UStruct {
	char UnknownData_B0[0x180]; // 0xb0(0x180)
};

// Class CoreUObject.Enum
// Size: 0x30 (Inherited: 0x30)
struct UEnum : UField {
	UE::FString CppType; //0x30
	UE::TArray<UE::TPair<FName, int64_t>> Names; //0x40
	int32_t CppForm; //0x50 (Enum type)
	void* EnumDisplayNameFn;
};

enum class EFunctionFlags : uint32_t
{
	FUNC_None = 0x00000000,
	FUNC_Final = 0x00000001,
	FUNC_RequiredAPI = 0x00000002,
	FUNC_BlueprintAuthorityOnly = 0x00000004,
	FUNC_BlueprintCosmetic = 0x00000008,
	FUNC_Net = 0x00000040,
	FUNC_NetReliable = 0x00000080,
	FUNC_NetRequest = 0x00000100,
	FUNC_Exec = 0x00000200,
	FUNC_Native = 0x00000400,
	FUNC_Event = 0x00000800,
	FUNC_NetResponse = 0x00001000,
	FUNC_Static = 0x00002000,
	FUNC_NetMulticast = 0x00004000,
	FUNC_UbergraphFunction = 0x00008000,
	FUNC_MulticastDelegate = 0x00010000,
	FUNC_Public = 0x00020000,
	FUNC_Private = 0x00040000,
	FUNC_Protected = 0x00080000,
	FUNC_Delegate = 0x00100000,
	FUNC_NetServer = 0x00200000,
	FUNC_HasOutParms = 0x00400000,
	FUNC_HasDefaults = 0x00800000,
	FUNC_NetClient = 0x01000000,
	FUNC_DLLImport = 0x02000000,
	FUNC_BlueprintCallable = 0x04000000,
	FUNC_BlueprintEvent = 0x08000000,
	FUNC_BlueprintPure = 0x10000000,
	FUNC_EditorOnly = 0x20000000,
	FUNC_Const = 0x40000000,
	FUNC_NetValidate = 0x80000000,
	FUNC_AllFlags = 0xFFFFFFFF,
};

// Class CoreUObject.Class
struct UFunction : UStruct {
	EFunctionFlags FunctionFlags;
	uint8_t NumParms;
	uint16_t ParmsSize;
	uint16_t ReturnValueOffset;
	uint16_t RPCId;
	uint16_t RPCResponseId;
	FProperty* FirstPropertyToInit;
	UFunction* EventGraphFunction;
	int32_t EventGraphCallOffset;
	void* Func;
};
}