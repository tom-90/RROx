#pragma once
#include "../message.h"
#include "getstruct.h"
#include "../../generator.h"

class GetStructTypeRequest : public Request {
public:
	std::string name;

	GetStructTypeRequest(Buffer& data);

	void Process() override;
};

class GetStructTypeResponse : public GetStructResponse {
public:
	GetStructTypeResponse() : GetStructResponse() {
		this->type = MessageType::GET_STRUCT_TYPE;
	};
	GetStructTypeResponse(GeneratedStruct* structObj) : GetStructResponse(structObj) {
		this->type = MessageType::GET_STRUCT_TYPE;
	};
	GetStructTypeResponse(GeneratedEnum* enumObj) : GetStructResponse(enumObj) {
		this->type = MessageType::GET_STRUCT_TYPE;
	};
	GetStructTypeResponse(GeneratedFunction* functionObj) : GetStructResponse(functionObj) {
		this->type = MessageType::GET_STRUCT_TYPE;
	};
};