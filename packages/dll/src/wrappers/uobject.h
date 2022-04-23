#pragma once
#include <string>
#include "base.h"
#include "../UE425/uobject.h"
#include "ffield.h"

class WUClass;

class WUObject : public Wrapper<UObject> {
public:
	using Wrapper::Wrapper;
	uint32_t GetIndex() const;
	WUClass GetClass() const;
	WUObject GetOuter() const;
	WUObject GetPackageObject() const;
	std::string GetName() const;
	std::string GetCppName() const;
	std::string GetFullName() const;

	UObject* get() { return object; }

	static WUClass StaticClass(std::string name);

	bool IsA(WUObject cmp) const;
	template <typename T> bool IsA() const;

	static const std::string ClassName;
};

class WUField : public WUObject {
public:
	using WUObject::WUObject;
	WUField GetNext();

	UField* get() { return reinterpret_cast<UField*>(object); }

	static const std::string ClassName;
};

class WUStruct : public WUField {
public:
	using WUField::WUField;
	WUStruct GetSuper();
	WFField GetChildProperties();
	WUField GetChildren();
	int32_t GetSize();

	UStruct* get() { return reinterpret_cast<UStruct*>(object); }

	static const std::string ClassName;
};

class WUClass : public WUStruct {
public:
	using WUStruct::WUStruct;

	UClass* get() { return reinterpret_cast<UClass*>(object); }

	static const std::string ClassName;
};

class WUFunction : public WUStruct {
public:
	using WUStruct::WUStruct;

	UFunction* get() { return reinterpret_cast<UFunction*>(object); }

	void* GetFunc();
	EFunctionFlags GetFunctionFlags();

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

	TArray<TPair<FName, int64_t>> GetNames();

	UEnum* get() { return reinterpret_cast<UEnum*>(object); }

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