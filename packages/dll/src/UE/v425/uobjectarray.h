#pragma once
#include <cstdint>
#include <string>
#include <algorithm>
#include "../base.h"
#include "uobject.h"

namespace UE425 {

struct FUObjectItem
{
	UObject* Object; //0x0
	int32_t Flags; //0x8
	int32_t ClusterRootIndex; //0xC
	int32_t SerialNumber; //0x10
};

struct TUObjectArray
{
	enum
	{
		NumElementsPerChunk = 64 * 1024,
	};

	FUObjectItem** Objects; //0x0
	FUObjectItem* PreAllocatedObjects; //0x8
	int32_t MaxElements; //0x10
	int32_t NumElements; //0x14
	int32_t MaxChunks; //0x18
	int32_t NumChunks; //0x1C

	FUObjectItem* GetObjectPtr(int32_t index);

	int32_t Num() const { return NumElements; }
	int32_t Capacity() const { return MaxElements; }
	bool IsValidIndex(int32_t Index) const { return Index < Num() && Index >= 0; }
};

struct FUObjectArray
{
	static std::unordered_map<std::string, FUObjectItem*> Cache;

	int32_t ObjFirstGCIndex; //0x0
	int32_t ObjLastNonGCIndex; //0x4
	int32_t OpenForDisregardForGC; //0x8

	char pad_C[0x4]; // 0xC (0x4)

	TUObjectArray ObjObjects; //0x10
};

}