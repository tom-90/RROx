#pragma once
#include <string>
#include "base.h"
#include "../UE/v425/uobjectarray.h"
#include "../UE/v503/uobjectarray.h"
#include "uobject.h"


class WFUObjectItem : public Wrapper<UEType(FUObjectItem*)> {
public:
	using Wrapper::Wrapper;

	UEVariant(FUObjectItem*) get() const { return object; }

	WUObject GetObject() const;
};

class WFUObjectArray : public Wrapper<UEType(FUObjectArray*)> {
private:
	std::unordered_map<std::string, UEVariant(FUObjectItem*)> cache = {};
public:
	using Wrapper::Wrapper;

	UEVariant(FUObjectArray*) get() const { return object; }
	void load(UEVariant(FUObjectArray*) arr) { object = arr; };

	WFUObjectItem FindObject(const std::string& name);
	WFUObjectItem FindInstance(const WUObject type);
	WFUObjectItem FindStatic(const WUObject type);
	std::vector<WFUObjectItem> FindInstances(const WUObject type, const uint32_t count = 0, const bool deep = false);
	std::vector<std::tuple<WUObject, WFUObjectItem>> FindInstances(const std::vector<WUObject>& types, const uint32_t count = 0, const bool deep = false);
	std::vector<std::string> GetNames();
};