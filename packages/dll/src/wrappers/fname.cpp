#include "fname.h"
#include "../injector.h"
#include "../UE/v425/fname.h"
#include "../UE/v503/fname.h"

std::string WFName::GetName() const UEAccessor(GetName());
uint32_t WFName::GetNumber() const UEAccessor(Number);
uint32_t WFName::GetIndex() const UEAccessor(Index);