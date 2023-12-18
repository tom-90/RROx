#include "getinstances.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"
#include "../../UE/v425/uobject.h"

GetInstancesRequest::GetInstancesRequest(Buffer& data) : Request(data), name(data.Read()), count(data.Read<uint32_t>()), deep(data.Read<bool>()) {}

void GetInstancesRequest::Process() {
	GetInstancesResponse res;

	WFUObjectItem item = injector.objectArray.FindObject(name);

	if (item) {
		std::vector<WFUObjectItem> instances = injector.objectArray.FindInstances(item.GetObject(), count, deep);
		for (auto instance : instances) {
			if (!instance)
				continue;

			res.names.push_back(instance.GetObject().GetFullName());
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