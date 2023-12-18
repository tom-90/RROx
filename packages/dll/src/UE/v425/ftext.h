#pragma once
#include <string>
#include "uobjectarray.h"
#include "../../injector.h"

namespace UE425 {

struct FTextData1
{
	unsigned char UnknownData00[0x8];
	wchar_t** Name;
};

struct FTextData2
{
	unsigned char UnknownData00[0x28];
	wchar_t* Name;
	uint32_t Length;
};


struct FTextData3
{
	unsigned char UnknownData00[0x10];
	wchar_t* Name;
	uint32_t Length;
};

union FTextData
{
	FTextData1 type1;
	FTextData2 type2;
	FTextData3 type3;
	UE::FString type4;
};

struct FText
{
	FTextData* Data;
	char UnknownData[0xC];

	wchar_t* Get()
	{
		if (!Data || IsBadReadPtr(Data, sizeof(Data))) return nullptr;

		// Atemmpt 1 to read FText
		wchar_t* str_1 = Data->type3.Name;
		if (!IsBadReadPtr(str_1, sizeof(str_1)))
			return str_1;

		// Atemmpt 2 to read FText
		wchar_t** str_ptr = Data->type1.Name;
		if (!IsBadReadPtr(str_ptr, sizeof(str_ptr))) {
			wchar_t* str = *str_ptr;
			if (!IsBadReadPtr(str, sizeof(str)))
				return str;
		}
		
		// Attempt 3 to read FText
		wchar_t* str_3 = Data->type2.Name;
		if (!IsBadReadPtr(str_3, sizeof(str_3)))
			return str_3;

		return nullptr;
	}

	std::string ToString()
	{
		wchar_t* data = Get();
		if (!data)
			return "";

		std::wstring wide = std::wstring(data);

		return std::string(wide.begin(), wide.end());
	}
};

}