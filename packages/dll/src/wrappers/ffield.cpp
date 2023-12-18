#include "ffield.h"
#include "../UE/v425/ffield.h"

WFFieldClass WFField::GetClass() UEAccessorT(ClassPrivate, WFFieldClass);
std::string WFField::GetName() UEAccessor(GetName());
std::string WFFieldClass::GetName() UEAccessor(GetName());
WFField WFField::GetNext()  UEAccessorT(Next, WFField);