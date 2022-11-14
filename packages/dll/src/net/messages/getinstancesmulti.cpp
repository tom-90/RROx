#include "getinstancesmulti.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"
#include "../../UE425/uobject.h"

GetInstancesMultiRequest::GetInstancesMultiRequest(Buffer& data) : Request(data), names() {
	uint64_t namesSize = data.Read<uint64_t>();
	for (uint64_t i =0; i < namesSize; i++)
	{
		names.push_back(data.Read());
	}

	count = data.Read<uint32_t>();
	deep = data.Read<bool>();
}

void GetInstancesMultiRequest::Process() {
	GetInstancesMultiResponse res;

	std::unordered_map<UObject*, uint32_t> indices;
	std::vector<UObject*> objects;
	uint32_t index = 0;
	for (auto name : names) {
		FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);
		if (item && item->Object) {
			objects.push_back(item->Object);
			indices.insert({ item->Object, index });
		}
		index++;
	}

	std::vector<std::tuple<UObject*, FUObjectItem*>> found = injector.memory.getSymbol<FUObjectArray>()->FindInstances(objects, count, deep);
	for (auto tuple : found) {
		UObject* type = std::get<0>(tuple);
		FUObjectItem* item = std::get<1>(tuple);
		std::unordered_map<UObject*, uint32_t>::const_iterator index = indices.find(type);

		if (!item || !item->Object || index == indices.end())
			continue;

		res.data.push_back({ index->second, item->Object->GetFullName() });
	}

	ProcessResponse(res);
}

void GetInstancesMultiResponse::Process(Buffer& buffer) {
	Response::Process(buffer);

	buffer.Write(data.size());
	for (auto& item : data)
	{
		buffer.Write(std::get<0>(item));
		buffer.Write(std::get<1>(item));
	}
}