#pragma once
#include <string>
#include <cstdint>
#include "base.h"
#include "../UE/v425/ffield.h"
#include "../UE/v503/ffield.h"
#include "../utils/hash.h"

class WFField;

class WFFieldClass : public Wrapper<UEType(FFieldClass*)> {
	friend class WFField;
private:
	uint64_t CachedHash = 0;
public:
	using Wrapper::Wrapper;

	std::string GetName();

	UEVariant(FFieldClass*) get() const { return CastVariant<UEType(FFieldClass*)>(); }
};

class WFField : public Wrapper<UEType(FField*)> {
public:
	using Wrapper::Wrapper;

	WFFieldClass GetClass();
	WFField GetNext();
	std::string GetName();

	template <typename T> bool IsA();

	UEVariant(FField*) get() const { return CastVariant<UEType(FField*)>(); }
};


template <typename T>
bool WFField::IsA() {
	uint64_t typeHash = T::Hash;

	auto propType = GetClass();
	if (propType.CachedHash == 0)
		propType.CachedHash = GetHash(propType.GetName());

	return propType.CachedHash == typeHash;
};