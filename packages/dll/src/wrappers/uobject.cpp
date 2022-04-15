#include "uobject.h"
#include "../injector.h"
#include "../UE425/uobjectarray.h"
#include "../UE425/uobject.h"

const std::string WUObject::ClassName = "Class CoreUObject.Object";
const std::string WUField::ClassName = "Class CoreUObject.Field";
const std::string WUStruct::ClassName = "Class CoreUObject.Struct";
const std::string WUClass::ClassName = "Class CoreUObject.Class";
const std::string WUFunction::ClassName = "Class CoreUObject.Function";
const std::string WUScriptStruct::ClassName = "Class CoreUObject.ScriptStruct";
const std::string WUEnum::ClassName = "Class CoreUObject.Enum";

uint32_t WUObject::GetIndex() const {
	if (!IsValid()) return 0;
	return object->InternalIndex;
};

WUClass WUObject::GetClass() const {
	if (!IsValid()) return WUClass();
	return object->ClassPrivate;
};

WUObject WUObject::GetOuter() const {
	if (!IsValid()) return WUObject();
	return object->OuterPrivate;
};

WUObject WUObject::GetPackageObject() const {
	if (!IsValid()) return WUObject();
	WUObject package;
	for (auto outer = GetOuter(); outer; outer = outer.GetOuter()) {
		package = outer;
	}
	return package;
};

std::string WUObject::GetName() const {
	if (!IsValid()) return "";
	return object->GetName();
};

std::string WUObject::GetFullName() const {
	if (!IsValid()) return "";
	return object->GetFullName();
};

std::string WUObject::GetCppName() const {
	std::string name;
	if (IsA<WUClass>()) {
		for (auto c = Cast<WUStruct>(); c; c = c.GetSuper()) {
			if (c == WUObject::StaticClass("Class Engine.Actor")) {
				name = "A";
				break;
			}
			else if (c == WUObject::StaticClass("Class CoreUObject.Property")) {
				name = "F";
				break;
			}
			else if (c == WUObject::StaticClass("Class CoreUObject.Object")) {
				name = "U";
				break;
			}
		}
	} else if (IsA<WUEnum>() || IsA<WUFunction>()) {
		name = "";
	} else {
		name = "F";
	}

	name += GetName();
	return name;
};

bool WUObject::IsA(WUObject cmp) const {
	if (!IsValid()) return false;
	for (WUStruct super = GetClass(); super; super = super.GetSuper()) {
		if (super == cmp) {
			return true;
		}
	}

	return false;
}

WUField WUStruct::GetChildren() {
	if (!IsValid()) return WUField();
	return get()->Children;
}

WUField WUField::GetNext() {
	if (!IsValid()) return WUField();
	return get()->Next;
}

WUStruct WUStruct::GetSuper() {
	if (!IsValid()) return WUStruct();
	return get()->SuperStruct;
}

int32_t WUStruct::GetSize() {
	if (!IsValid()) return 0;
	return get()->PropertiesSize;
};

WFField WUStruct::GetChildProperties() {
	if (!IsValid()) return WFField();
	return get()->ChildProperties;
}

TArray<TPair<FName, int64_t>> WUEnum::GetNames() {
	if (!IsValid()) return {nullptr, 0, sizeof(TPair<FName, int64_t>)};
	return get()->Names;
}

void* WUFunction::GetFunc() {
	if (!IsValid()) return nullptr;
	return get()->Func;
}

EFunctionFlags WUFunction::GetFunctionFlags() {
	if (!IsValid()) return EFunctionFlags::FUNC_None;
	return get()->FunctionFlags;
}

WUClass WUObject::StaticClass(std::string name) {
	return injector.memory.getSymbol<FUObjectArray>()->FindObject(name)->Object;
};