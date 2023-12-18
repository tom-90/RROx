#include "getstructlist.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"

GetStructListRequest::GetStructListRequest(Buffer& data) : Request(data) {}

void GetStructListRequest::Process() {
	GetStructListResponse res;

	res.names = injector.objectArray.GetNames();

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