#include "getstructtype.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"

GetStructTypeRequest::GetStructTypeRequest(Buffer& data) : Request(data), name(data.Read()) {}

void GetStructTypeRequest::Process() {
	GetStructTypeResponse res;

	injector.log("Retrieving struct type for: " + name);

	WFUObjectItem item = injector.objectArray.FindObject(name);

	if (item) {
		WUObject wrappedObj = item.GetObject();
		WUClass wrappedClass = wrappedObj.GetClass();
		res = GetStructTypeResponse(new GeneratedStruct(wrappedClass));
	}

	ProcessResponse(res);
}