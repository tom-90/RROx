#include "getinstances.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"
#include "../../UE425/uobject.h"

GetInstancesRequest::GetInstancesRequest(Buffer& data) : Request(data), name(data.Read()), count(data.Read<uint32_t>()), deep(data.Read<bool>()) {}

void GetInstancesRequest::Process() {
	GetInstancesResponse res;

	FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);

	if (item && item->Object) {
		std::vector<FUObjectItem*> instances = injector.memory.getSymbol<FUObjectArray>()->FindInstances(item->Object, count, deep);
		for (auto instance : instances) {
			if (!instance || !instance->Object)
				continue;

			res.names.push_back(instance->Object->GetFullName());
		}
	}

	ProcessResponse(res);
}

void GetInstancesResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(names.size());
	for (auto& name : names)
	{
		data.Write(name);
	}
}