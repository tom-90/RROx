#pragma once
#include <string>
#include "base.h"
#include "../UE/v425/ftext.h"
#include "../UE/v503/ftext.h"

class WFText : public Wrapper<UEType(FText*)> {
public:
	using Wrapper::Wrapper;

    std::string ToString() const;

	UEVariant(FText*) get() const { return object; }
};