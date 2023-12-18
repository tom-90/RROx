#include "uobject.h"
#include "../injector.h"
#include "../UE/v425/uobjectarray.h"
#include "../UE/v425/uobject.h"

const std::string WUObject::ClassName = "Class CoreUObject.Object";
const std::string WUField::ClassName = "Class CoreUObject.Field";
const std::string WUStruct::ClassName = "Class CoreUObject.Struct";
const std::string WUClass::ClassName = "Class CoreUObject.Class";
const std::string WUFunction::ClassName = "Class CoreUObject.Function";
const std::string WUScriptStruct::ClassName = "Class CoreUObject.ScriptStruct";
const std::string WUEnum::ClassName = "Class CoreUObject.Enum";

uint32_t WUObject::GetIndex() const UEAccessor(InternalIndex);
WUClass WUObject::GetClass() const UEAccessorT(ClassPrivate, WUClass);
WUObject WUObject::GetOuter() const UEAccessorT(OuterPrivate, WUObject);
std::string WUObject::GetName() const UEAccessor(GetName())
std::string WUObject::GetFullName() const UEAccessor(GetFullName());
void WUObject::ProcessEvent(WUFunction fnW, void* parms) const {
	if(!IsValid()) return;
	std::visit([fnW, parms](auto&& obj) {
		using FuncType = typename std::decay_t<decltype(*obj)>::FunctionType;

		auto fnV = fnW.get();
		if(!std::holds_alternative<FuncType>(fnV)) return;
		auto fn = std::get<FuncType>(fnV);

		obj->ProcessEvent(fn, parms);
	}, get());
}

WUObject WUObject::GetPackageObject() const {
	if (!IsValid()) return WUObject();
	WUObject package;
	for (auto outer = GetOuter(); outer; outer = outer.GetOuter()) {
		package = outer;
	}
	return package;
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

WUField WUStruct::GetChildren() const UEAccessorT(Children, WUField);
WUField WUField::GetNext() const UEAccessorT(Next, WUField);
WUStruct WUStruct::GetSuper() const UEAccessorT(SuperStruct, WUStruct);
int32_t WUStruct::GetSize() const UEAccessor(PropertiesSize);
WFField WUStruct::GetChildProperties() const UEAccessorT(ChildProperties, WFField);

WUEnum::Names WUEnum::GetNames() {
	if (!IsValid()) {
		// Needs explicit UE425 reference to construct empty type
		UE::TArray<UE::TPair<UE425::FName, int64_t>> empty = {nullptr, 0, sizeof(UE::TPair<UE425::FName, int64_t>)};
		return empty;
	}
	return std::visit([](auto&& obj) -> WUEnum::Names { return obj->Names; }, get());
}

void* WUFunction::GetFunc() UEAccessor(Func);

UEVariant(EFunctionFlags) WUFunction::GetFunctionFlags() UEAccessorT(FunctionFlags, UEVariant(EFunctionFlags));

WUClass WUObject::StaticClass(std::string name) {
	return injector.objectArray.FindObject(name).GetObject().Cast<WUClass>();
};