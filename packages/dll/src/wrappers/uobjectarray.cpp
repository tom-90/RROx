#include "uobjectarray.h"
#include "../injector.h"
#include "../UE/v425/uobjectarray.h"
#include "../UE/v503/uobjectarray.h"
#include "./uobject.h"

WFUObjectItem WFUObjectArray::FindObject(const std::string& name) {
	std::string nameLowerCase = name;
	std::transform(nameLowerCase.begin(), nameLowerCase.end(), nameLowerCase.begin(), ::tolower);

	std::unordered_map<std::string, UEVariant(FUObjectItem*)>::const_iterator cached = cache.find(nameLowerCase);

	if (cached != cache.end()) {
		UEVariant(FUObjectItem*) item = cached->second;

		bool isValid = std::visit([nameLowerCase](auto&& item) -> bool {
			using ItemType = std::decay_t<decltype(item)>;
			using ObjectType = std::decay_t<decltype(item->Object)>;

			if (item && !IsBadReadPtr(item, sizeof(ItemType))
				&& item->Object && !IsBadReadPtr(item->Object, sizeof(ObjectType))) {
				std::string objectName = item->Object->GetFullName();
				std::transform(objectName.begin(), objectName.end(), objectName.begin(), ::tolower);
				if(objectName == nameLowerCase)
					return true;
			}

			return false;
		}, item);

		if (isValid)
			return item;

		cache.erase(cached);
	}

	return std::visit([this, nameLowerCase](auto&& objArray) -> WFUObjectItem {
		for (int32_t i = 0; i < objArray->ObjObjects.NumElements; i++) {
			auto item = objArray->ObjObjects.GetObjectPtr(i);

			if (item && item->Object) {
				std::string foundName = item->Object->GetFullName();
				std::transform(foundName.begin(), foundName.end(), foundName.begin(), ::tolower);

				if (cache.find(foundName) == cache.end())
					cache.insert({ foundName, item });

				if (foundName == nameLowerCase)
					return item;
			}
		}
		return {};
	}, object);
};

WFUObjectItem WFUObjectArray::FindInstance(const WUObject obj) {
	auto instances = FindInstances(obj, 1, false);
	if(instances.size() == 0)
		return {};
	return instances[0];
};

bool IsObjectTemplate(UEVariant(UObject*) object) {
	return std::visit([](auto&& obj) -> bool {
		using ObjectFlagsType = std::decay_t<decltype(obj->ObjectFlags)>;

		for (auto TestOuter = obj; TestOuter; TestOuter = TestOuter->OuterPrivate)
		{
			if ((TestOuter->ObjectFlags & (ObjectFlagsType::RF_ArchetypeObject | ObjectFlagsType::RF_ClassDefaultObject)) != ObjectFlagsType::RF_NoFlags) {
				return true;
			}
		}

		return false;
	}, object);
}

bool HasSuper(const UEVariant(UObject*) obj, const WUClass cls) {
	if (!cls)
		return false;

	WUStruct super = cls.GetSuper();
	UEVariant(UObject*) superObj = super.Cast<WUObject>().get();

	if (!super)
		return false;
	if (superObj == obj)
		return true;
	if (!super.IsA<WUClass>())
		return false;

	return HasSuper(obj, super.Cast<WUClass>());
}

std::vector<WFUObjectItem> WFUObjectArray::FindInstances(const WUObject objW, const uint32_t count, const bool deep) {
	return std::visit([objW, count, deep](auto&& objectArr) -> std::vector<WFUObjectItem> {
		std::vector<WFUObjectItem> instances;

		using UObjectPtr = std::decay_t<decltype(objectArr->ObjObjects.GetObjectPtr(0)->Object)>;
		auto objV = objW.get();
		if (!std::holds_alternative<UObjectPtr>(objV))
			return instances;

		auto obj = std::get<UObjectPtr>(objV);

		for (int32_t i = 0; i < objectArr->ObjObjects.NumElements; i++) {
			auto item = objectArr->ObjObjects.GetObjectPtr(i);

			if (item && item->Object && obj) {
				if (obj == item->Object->ClassPrivate || (deep && HasSuper(obj, item->Object->ClassPrivate))) {
					if (IsObjectTemplate(item->Object))
						continue;

					instances.push_back(item);
					if (count > 0 && instances.size() == count)
						return instances;
				}
			}
		}

		return instances;
	}, object);
};

std::vector<std::tuple<WUObject, WFUObjectItem>> WFUObjectArray::FindInstances(const std::vector<WUObject>& objWs, const uint32_t count, const bool deep) {
	return std::visit([objWs, count, deep](auto&& objectArr) -> std::vector<std::tuple<WUObject, WFUObjectItem>> {
		using UObjectPtr = std::decay_t<decltype(objectArr->ObjObjects.GetObjectPtr(0)->Object)>;

		std::vector<std::tuple<WUObject, WFUObjectItem>> instances;
		std::vector<UObjectPtr> objs;

		for (auto objW : objWs) {
			auto objV = objW.get();
			if (std::holds_alternative<UObjectPtr>(objV))
				objs.push_back(std::get<UObjectPtr>(objV));
		}

		for (int32_t i = 0; i < objectArr->ObjObjects.NumElements; i++) {
			auto item = objectArr->ObjObjects.GetObjectPtr(i);

			if (item && item->Object) {
				for (auto obj : objs) {
					if (item->Object->ClassPrivate == obj || (deep && HasSuper(obj, item->Object->ClassPrivate))) {
						if (IsObjectTemplate(item->Object))
							continue;

						instances.push_back({ obj, item });
						if (count > 0 && instances.size() == count)
							return instances;
					}
				}
			}
		}

		return instances;
	}, object);
};

WFUObjectItem WFUObjectArray::FindStatic(const WUObject objW) {
	return std::visit([objW](auto&& objectArr) -> WFUObjectItem {
		using UObjectPtr = std::decay_t<decltype(objectArr->ObjObjects.GetObjectPtr(0)->Object)>;

		auto objV = objW.get();
		if (!std::holds_alternative<UObjectPtr>(objV))
			return {};

		auto obj = std::get<UObjectPtr>(objV);

		for (int32_t i = 0; i < objectArr->ObjObjects.NumElements; i++) {
			auto item = objectArr->ObjObjects.GetObjectPtr(i);

			if (item && item->Object && obj) {
				if (item->Object->ClassPrivate == obj) {
					if (!IsObjectTemplate(item->Object))
						continue;

					return item;
				}
			}
		}

		return {};
	}, object);
};

std::vector<std::string> WFUObjectArray::GetNames() {
	return std::visit([](auto&& objectArr) -> std::vector<std::string> {
		std::vector<std::string> names;

		for (int32_t i = 0; i < objectArr->ObjObjects.NumElements; i++) {
			auto item = objectArr->ObjObjects.GetObjectPtr(i);
			if (item->Object != nullptr) {
				names.push_back(item->Object->GetFullName());
			}
		}

		return names;
	}, object);
};

WUObject WFUObjectItem::GetObject() const UEAccessorT(Object, WUObject);