#pragma once
#include <string>
#include "fname.h"

namespace UE425 {

struct FFieldClass;
struct FField;
struct UObject;

struct FFieldVariant {
	union FFieldObjectUnion
	{
		FField* Field;
		UObject* Object;
	} Container;

	bool bIsUObject;
};

struct FField {
	void** VFTable;

	/** Pointer to the class object representing the type of this FField */
	FFieldClass* ClassPrivate;

	FFieldVariant Owner;

	/** Next Field in the linked list */
	FField* Next;

	/** Name of this field */
	FName NamePrivate;

	char pad_20[0x08]; // 0x20 (0x08)

	std::string GetName();
};

struct FFieldClass {
	FName Name;

	char pad_08[0x30]; // 0x08 (0x30)

	std::string GetName();
};

}