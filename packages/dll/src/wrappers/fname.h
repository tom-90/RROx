#pragma once
#include <string>
#include "base.h"
#include "../UE/v425/fname.h"
#include "../UE/v503/fname.h"

class WFName : public Wrapper<UEType(FName*)> {
public:
	using Wrapper::Wrapper;

    std::string GetName() const;
    uint32_t GetNumber() const;
    uint32_t GetIndex() const;

	UEVariant(FName*) get() const { return object; }
};