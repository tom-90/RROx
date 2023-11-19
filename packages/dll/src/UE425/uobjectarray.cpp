#include "uobjectarray.h"
#include <Windows.h>
#include "../wrappers/uobject.h"

std::unordered_map<std::string, FUObjectItem*> FUObjectArray::Cache = {};

FUObjectItem* TUObjectArray::GetObjectPtr(int32_t Index) {
	const int32_t ChunkIndex = Index / NumElementsPerChunk;
	const int32_t WithinChunkIndex = Index % NumElementsPerChunk;

	if (!IsValidIndex(Index) || ChunkIndex >= NumChunks || Index >= MaxElements)
		return nullptr;

	FUObjectItem* Chunk = Objects[ChunkIndex];

	return Chunk + WithinChunkIndex;
}

FUObjectItem* FUObjectArray::FindObject(const std::string& name) {
	std::string nameLowerCase = name;
	std::transform(nameLowerCase.begin(), nameLowerCase.end(), nameLowerCase.begin(), ::tolower);

	std::unordered_map<std::string, FUObjectItem*>::const_iterator cached = Cache.find(nameLowerCase);

	if (cached != Cache.end()) {
		FUObjectItem* item = cached->second;

		if (item && !IsBadReadPtr(item, sizeof(FUObjectItem*))
			&& item->Object && !IsBadReadPtr(item->Object, sizeof(UObject*))) {
			std::string objectName = item->Object->GetFullName();
			std::transform(objectName.begin(), objectName.end(), objectName.begin(), ::tolower);
			if(objectName == nameLowerCase)
				return item;
		}

		Cache.erase(cached);
	}

	for (int32_t i = 0; i < ObjObjects.NumElements; i++) {
		FUObjectItem* item = ObjObjects.GetObjectPtr(i);

		if (item && item->Object) {
			std::string foundName = item->Object->GetFullName();
			std::transform(foundName.begin(), foundName.end(), foundName.begin(), ::tolower);

			if (Cache.find(foundName) == Cache.end())
				Cache.insert({ foundName, item });

			if (foundName == nameLowerCase)
				return item;
		}
	}
	return nullptr;
};

bool IsObjectTemplate(UObject* object) {
	for (const UObject* TestOuter = object; TestOuter; TestOuter = TestOuter->OuterPrivate)
	{
		if ((TestOuter->ObjectFlags & (EObjectFlags::RF_ArchetypeObject | EObjectFlags::RF_ClassDefaultObject)) != EObjectFlags::RF_NoFlags) {
			return true;
		}
	}

	return false;
}

FUObjectItem* FUObjectArray::FindInstance(const UObject* obj) {
	auto instances = FindInstances(obj, 1, false);
	if(instances.size() == 0)
		return nullptr;
	return instances[0];
};

bool HasSuper(const UObject* obj, UClass* cls) {
	if (!cls)
		return false;

	WUClass wrapped = cls;
	WUStruct super = wrapped.GetSuper();

	if (!super)
		return false;
	if (super == obj)
		return true;
	if (!super.IsA<WUClass>())
		return false;
	return HasSuper(obj, (UClass*)super.get());
}

std::vector<FUObjectItem*> FUObjectArray::FindInstances(const UObject* obj, const uint32_t count, const bool deep) {
	std::vector<FUObjectItem*> instances;

	for (int32_t i = 0; i < ObjObjects.NumElements; i++) {
		FUObjectItem* item = ObjObjects.GetObjectPtr(i);

		if (item && item->Object) {
			if (item->Object->ClassPrivate == obj || (deep && HasSuper(obj, item->Object->ClassPrivate))) {
				if (IsObjectTemplate(item->Object))
					continue;

				instances.push_back(item);
				if (count > 0 && instances.size() == count)
					return instances;
			}
		}
	}

	return instances;
};

std::vector<std::tuple<UObject*, FUObjectItem*>> FUObjectArray::FindInstances(const std::vector<UObject*>& objs, const uint32_t count, const bool deep) {
	std::vector<std::tuple<UObject*, FUObjectItem*>> instances;

	for (int32_t i = 0; i < ObjObjects.NumElements; i++) {
		FUObjectItem* item = ObjObjects.GetObjectPtr(i);

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
};

FUObjectItem* FUObjectArray::FindStatic(const UObject* obj) {
	for (int32_t i = 0; i < ObjObjects.NumElements; i++) {
		FUObjectItem* item = ObjObjects.GetObjectPtr(i);

		if (item && item->Object) {
			if (item->Object->ClassPrivate == obj) {
				if (!IsObjectTemplate(item->Object))
					continue;

				return item;
			}
		}
	}

	return nullptr;
};