#include "getstructlist.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"

GetStructListRequest::GetStructListRequest(Buffer& data) : Request(data) {}

void GetStructListRequest::Process() {
	GetStructListResponse res;

	FUObjectArray* arr = injector.memory.getSymbol<FUObjectArray>();
	for (int32_t i = 0; i < arr->ObjObjects.NumElements; i++) {
		FUObjectItem* item = arr->ObjObjects.GetObjectPtr(i);
		if (item->Object != nullptr) {
			res.names.push_back(item->Object->GetFullName());
		}
	}

	ProcessResponse(res);
}

void GetStructListResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(names.size());
	for (auto& name : names)
	{
		data.Write(name);
	}
}