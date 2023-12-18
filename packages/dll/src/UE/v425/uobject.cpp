#include "uobject.h"

namespace UE425 {
int UObjectProcessEventOffset = 0x4B;

std::string UObject::GetFullName() {
	std::string name;
	for (auto outer = OuterPrivate; outer; outer = outer->OuterPrivate) { name = outer->GetName() + "." + name; }
	name = ClassPrivate->GetName() + " " + name + this->GetName();
	return name;
}

std::string UObject::GetName()
{
	return NamePrivate.GetName();
}

void UObject::ProcessEvent(UFunction* fn, void* parms)
{
	auto vtable = *reinterpret_cast<void***>(this);
	reinterpret_cast<void(*)(void*, void*, void*)>(vtable[UObjectProcessEventOffset])(this, fn, parms);
}
}