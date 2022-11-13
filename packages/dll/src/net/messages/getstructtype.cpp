#include "getstructtype.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"

GetStructTypeRequest::GetStructTypeRequest(Buffer& data) : Request(data), name(data.Read()) {}

void GetStructTypeRequest::Process() {
	GetStructTypeResponse res;

	injector.log("Retrieving struct type for: " + name);

	FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);

	if (item && item->Object) {
		WUObject wrappedObj = item->Object;
		WUClass wrappedClass = wrappedObj.GetClass();
		res = GetStructTypeResponse(new GeneratedStruct(wrappedClass));
	}

	ProcessResponse(res);
}