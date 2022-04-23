#pragma once
#include "../message.h"
#include "../../generator.h"

class GetStructListRequest : public Request {
public:
	GetStructListRequest(Buffer& data);

	void Process() override;
};

class GetStructListResponse : public Response {
public:
	std::vector<std::string> names;

	GetStructListResponse() : Response(MessageType::GET_STRUCT_LIST) {};
	GetStructListResponse(std::vector<std::string> names) : names(names), Response(MessageType::GET_STRUCT_LIST) {};

	void Process(Buffer& data) override;
};