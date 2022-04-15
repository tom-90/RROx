#include "ffield.h"
#include "../UE425/ffield.h"

WFFieldClass WFField::GetClass() {
	if (!IsValid()) return WFFieldClass();
	return object->ClassPrivate;
}

std::string WFField::GetName() {
	if (!IsValid()) return "";
	return get()->GetName();
}

std::string WFFieldClass::GetName() {
	if (!IsValid()) return "";
	return object->GetName();
}

WFField WFField::GetNext() {
	if (!IsValid()) return WFField();
	return get()->Next;
}