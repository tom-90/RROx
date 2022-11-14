#include "getstruct.h"
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"

GetStructRequest::GetStructRequest(Buffer& data) : Request(data), name(data.Read()) {}

void GetStructRequest::Process() {
	GetStructResponse res;

	injector.log("Retrieving struct: " + name);

	FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);

	if (item && item->Object) {
		WUObject wrapped = item->Object;
		if (wrapped.IsA<WUEnum>())
			res = GetStructResponse(new GeneratedEnum(wrapped.Cast<WUEnum>()));
		else if (wrapped.IsA<WUFunction>())
			res = GetStructResponse(new GeneratedFunction(wrapped.Cast<WUFunction>()));
		else if (wrapped.IsA<WUStruct>())
			res = GetStructResponse(new GeneratedStruct(wrapped.Cast<WUStruct>()));
	}

	ProcessResponse(res);
}

void GetStructResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(structType);

	if (structType == StructResponseType::Struct && structObj)
		structObj->Serialize(data);
	else if (structType == StructResponseType::Function && functionObj)
		functionObj->Serialize(data);
	else if (structType == StructResponseType::Enum && enumObj)
		enumObj->Serialize(data);
}