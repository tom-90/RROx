#pragma once
#include <string>
#include "uobjectarray.h"
#include "../injector.h"

/*struct FText
{
	char UnknownData[0x38];
};



std::string FTextToString(FText& text)
{
	FUObjectArray* arr = injector.memory.getSymbol<FUObjectArray>();
	FUObjectItem* item = arr->FindObject("Class Engine.KismetTextLibrary");
	if (!item || !item->Object)
		return "";

	FUObjectItem* staticInstance = arr->FindStatic(item->Object);
	if (!staticInstance || !staticInstance->Object)
		return "";

	injector.log(staticInstance->Object->GetFullName());

	FUObjectItem* func = arr->FindObject("Function Engine.KismetTextLibrary.Conv_TextToString");
	if (!func || !func->Object)
		return "";

	injector.log(func->Object->GetFullName());

	struct {
		FText InText;
		FString ReturnValue;
	} params;

	params.InText = text;

	staticInstance->Object->ProcessEvent((UFunction*)func->Object, &params);

	return params.ReturnValue.ToString();
}*/

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

union FTextData
{
	FTextData1 type1;
	FTextData2 type2;
};

struct FText
{
	FTextData* Data;
	char UnknownData[0xC];

	wchar_t* Get()
	{
		if (!Data || IsBadReadPtr(Data, sizeof(Data))) return nullptr;

		// Atemmpt 1 to read FText
		wchar_t** str_ptr = Data->type1.Name;
		if (!IsBadReadPtr(str_ptr, sizeof(str_ptr))) {
			wchar_t* str = *str_ptr;
			if (!IsBadReadPtr(str, sizeof(str)))
				return str;
		}
		
		// Attempt 2 to read FText
		wchar_t* str = Data->type2.Name;
		if (!IsBadReadPtr(str, sizeof(str)))
			return str;

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