#include "getinstancesmulti.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"
#include "../../UE/v425/uobject.h"

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

	std::unordered_map<void*, uint32_t> indices;
	std::vector<WUObject> objects;
	uint32_t index = 0;
	for (auto name : names) {
		WFUObjectItem item = injector.objectArray.FindObject(name);
		if (item) {
			objects.push_back(item.GetObject());
			void* ptr = std::visit([](auto&& obj) -> void* { return obj; }, item.GetObject().get());

			indices.insert({ ptr, index});
		}
		index++;
	}

	std::vector<std::tuple<WUObject, WFUObjectItem>> found = injector.objectArray.FindInstances(objects, count, deep);
	for (auto tuple : found) {
		WUObject type = std::get<0>(tuple);
		WFUObjectItem item = std::get<1>(tuple);

		void* ptr = std::visit([](auto&& obj) -> void* { return obj; }, type.get());
		std::unordered_map<void*, uint32_t>::const_iterator index = indices.find(ptr);

		if (!item || !item.GetObject() || index == indices.end())
			continue;

		res.data.push_back({ index->second, item.GetObject().GetFullName() });
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