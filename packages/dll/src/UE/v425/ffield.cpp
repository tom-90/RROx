#include "ffield.h"

namespace UE425 {

std::string FFieldClass::GetName()
{
	return Name.GetName();
}

std::string FField::GetName()
{
	return NamePrivate.GetName();
}

}