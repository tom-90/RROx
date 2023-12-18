#pragma once
#include <string>
#include "base.h"
#include "../UE/v425/uobject.h"
#include "../UE/v503/uobject.h"
#include "ffield.h"

class WUClass;
class WUFunction;

class WUObject : public Wrapper<UEType(UObject*)> {
public:
	using Wrapper::Wrapper;
	uint32_t GetIndex() const;
	WUClass GetClass() const;
	WUObject GetOuter() const;
	WUObject GetPackageObject() const;
	std::string GetName() const;
	std::string GetCppName() const;
	std::string GetFullName() const;
	void ProcessEvent(WUFunction fn, void* parms) const;

	UEVariant(UObject*) get() const { return object; }

	static WUClass StaticClass(std::string name);

	bool IsA(WUObject cmp) const;
	template <typename T> bool IsA() const;

	static const std::string ClassName;
};

class WUField : public WUObject {
public:
	using WUObject::WUObject;
	WUField GetNext() const;

	UEVariant(UField*) get() const { return CastVariant<UEType(UField*)>(); }

	static const std::string ClassName;
};

class WUStruct : public WUField {
public:
	using WUField::WUField;
	WUStruct GetSuper() const;
	WFField GetChildProperties() const;
	WUField GetChildren() const;
	int32_t GetSize() const;

	UEVariant(UStruct*) get() const { return CastVariant<UEType(UStruct*)>(); }

	static const std::string ClassName;
};

class WUClass : public WUStruct {
public:
	using WUStruct::WUStruct;

	UEVariant(UClass*) get() const { return CastVariant<UEType(UClass*)>(); }

	static const std::string ClassName;
};

class WUFunction : public WUStruct {
public:
	using WUStruct::WUStruct;

	UEVariant(UFunction*) get() const { return CastVariant<UEType(UFunction*)>(); }

	void* GetFunc();
	UEVariant(EFunctionFlags) GetFunctionFlags();

	static const std::string ClassName;
};

class WUScriptStruct : public WUStruct {
public:
	using WUStruct::WUStruct;

	static const std::string ClassName;
};

class WUEnum : public WUField {
public:
	using WUField::WUField;

	// Needs explicit UE425/503 variants because of complex type
	using Names = std::variant<
		UE::TArray<UE::TPair<UE425::FName, int64_t>>,
		UE::TArray<UE::TPair<UE503::FName, int64_t>>
	>;

	Names GetNames();

	UEVariant(UEnum*) get() const { return CastVariant<UEType(UEnum*)>(); }

	static const std::string ClassName;
};


template <typename T>
bool WUObject::IsA() const {
	auto cmp = WUObject::StaticClass(T::ClassName);
	if (!cmp) {
		return false;
	}

	return IsA(cmp);
};