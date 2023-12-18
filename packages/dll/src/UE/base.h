#pragma once
#include <cstdint>
#include <Windows.h>
#include <string>

namespace UE {

template<typename T>
struct TArray {
	T* Data;
	int Count;
	int ArraySize;
};

struct FString : TArray<wchar_t> {
	std::wstring ToWString() const
	{
		if (!Data || IsBadReadPtr(Data, sizeof(Data))) return std::wstring();
		return std::wstring(Data);
	}

	std::string ToString() const
	{
		std::wstring ws = ToWString();
		return std::string(ws.begin(), ws.end());
	}
};

template<class TEnum>
struct TEnumAsByte {
	uint8_t Value;
};

template <typename InKeyType, typename InValueType>
struct TTuple {
	InKeyType   Key;
	InValueType Value;
};

template <typename KeyType, typename ValueType>
using TPair = TTuple<KeyType, ValueType>;

}