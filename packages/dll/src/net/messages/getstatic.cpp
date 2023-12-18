#include "getstatic.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"

GetStaticRequest::GetStaticRequest(Buffer& data) : Request(data), name(data.Read()) {}

void GetStaticRequest::Process() {
	GetStaticResponse res;

	WFUObjectItem item = injector.objectArray.FindObject(name);

	if (item) {
		WFUObjectItem staticInstance = injector.objectArray.FindStatic(item.GetObject());
		if (staticInstance) {
			res.name = staticInstance.GetObject().GetFullName();
		}
	}

	ProcessResponse(res);
}

void GetStaticResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(name);
}