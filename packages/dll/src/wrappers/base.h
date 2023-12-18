#pragma once
#include <variant>

enum class EVersion
{
	UE425,
	UE500,
	UE503,
};

template <typename UE425Type, typename UE503Type>
class Wrapper {
protected:
	std::variant<UE425Type, UE503Type> object;

	template <typename UE425Type2, typename UE503Type2>
	std::variant<UE425Type2, UE503Type2> CastVariant() const {
		if (std::holds_alternative<UE425Type>(object)) {
			return reinterpret_cast<UE425Type2>(std::get<UE425Type>(object));
		} else if (std::holds_alternative<UE503Type>(object)) {
			return reinterpret_cast<UE503Type2>(std::get<UE503Type>(object));
		} else {
			return {};
		}
	}
public:
	using UE425T = UE425Type;
	using UE503T = UE503Type;

	Wrapper(std::variant<UE425Type, UE503Type> object) : object(object) {}
	Wrapper(UE425Type object) : object(object) {}
	Wrapper(UE503Type object) : object(object) {}
	Wrapper() : object(std::in_place_index<0>, nullptr) {}
	Wrapper(void* object, EVersion version);

	bool operator==(const Wrapper<UE425Type, UE503Type> obj) const { return obj.object == object; };
	bool operator!=(const Wrapper<UE425Type, UE503Type> obj) const { return obj.object != object; };

	operator bool() const { return IsValid(); }

	template <typename WrapperBase> WrapperBase Cast() const { return WrapperBase(CastVariant<typename WrapperBase::UE425T, typename WrapperBase::UE503T>()); }

	bool IsValid() const {
		if(std::holds_alternative<UE425Type>(object)) {
			return std::get<UE425Type>(object) != nullptr;
		} else if (std::holds_alternative<UE503Type>(object)) {
			return std::get<UE503Type>(object) != nullptr;
		} else {
			return false;
		}
	}
};

template <typename UE425Type, typename UE503Type>
Wrapper<UE425Type, UE503Type>::Wrapper(void* object, EVersion version) {
	switch (version) {
		case EVersion::UE425:
		case EVersion::UE500:
			this->object = reinterpret_cast<UE425Type>(object);
			break;
		case EVersion::UE503:
			this->object = reinterpret_cast<UE503Type>(object);
			break;
		default:
			this->object = { std::in_place_index<0>, nullptr };
			break;
	}
}

#define UEType(Type) UE425::Type, UE503::Type
#define UEVariant(Type) std::variant<UEType(Type)>
#define UEAccessorT(Property, ReturnType) {\
	if(!IsValid()) return {}; \
	return std::visit([](auto&& obj) -> ReturnType { return obj->Property; }, get()); \
}
#define UEAccessor(Property) UEAccessorT(Property, auto)