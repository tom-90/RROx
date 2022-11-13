#pragma once
#include "../message.h"
#include "../../generator.h"

class GetStructRequest : public Request {
public:
	std::string name;

	GetStructRequest(Buffer& data);

	void Process() override;
};

enum class StructResponseType {
	NotFound,
	Struct,
	Enum,
	Function
};

class GetStructResponse : public Response {
private:
	std::unique_ptr<GeneratedStruct> structObj{};
	std::unique_ptr<GeneratedEnum> enumObj{};
	std::unique_ptr<GeneratedFunction> functionObj{};
	StructResponseType structType;

public:
	GetStructResponse() : structType(StructResponseType::NotFound), Response(MessageType::GET_STRUCT) {};
	GetStructResponse(GeneratedStruct* structObj) : structType(StructResponseType::Struct), structObj(structObj), Response(MessageType::GET_STRUCT) {};
	GetStructResponse(GeneratedEnum* enumObj) : structType(StructResponseType::Enum), enumObj(enumObj), Response(MessageType::GET_STRUCT) {};
	GetStructResponse(GeneratedFunction* functionObj) : structType(StructResponseType::Function), functionObj(functionObj), Response(MessageType::GET_STRUCT) {};

	void Process(Buffer& data) override;
};