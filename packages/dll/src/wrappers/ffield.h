#pragma once
#include <string>
#include <cstdint>
#include "base.h"
#include "../UE425/ffield.h"
#include "../utils/hash.h"

class WFField;

class WFFieldClass : public Wrapper<FFieldClass> {
	friend class WFField;
private:
	uint64_t CachedHash = 0;
public:
	using Wrapper::Wrapper;

	std::string GetName();

	FFieldClass* get() { return reinterpret_cast<FFieldClass*>(object); }
};

class WFField : public Wrapper<FField> {
public:
	using Wrapper::Wrapper;

	WFFieldClass GetClass();
	WFField GetNext();
	std::string GetName();

	template <typename T> bool IsA();

	FField* get() { return reinterpret_cast<FField*>(object); }
};


template <typename T>
bool WFField::IsA() {
	uint64_t typeHash = T::Hash;

	auto propType = GetClass();
	if (propType.CachedHash == 0)
		propType.CachedHash = GetHash(propType.GetName());

	return propType.CachedHash == typeHash;
};