#include "ffield.h"

std::string FFieldClass::GetName()
{
	return Name.GetName();
}

std::string FField::GetName()
{
	return NamePrivate.GetName();
}