#include "getstatic.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"

GetStaticRequest::GetStaticRequest(Buffer& data) : Request(data), name(data.Read()) {}

void GetStaticRequest::Process() {
	GetStaticResponse res;

	FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);

	if (item && item->Object) {
		FUObjectItem* staticInstance = injector.memory.getSymbol<FUObjectArray>()->FindStatic(item->Object);
		if (staticInstance && staticInstance->Object) {
			res.name = staticInstance->Object->GetFullName();
		}
	}

	ProcessResponse(res);
}

void GetStaticResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(name);
}