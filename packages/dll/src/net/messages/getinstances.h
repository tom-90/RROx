#pragma once
#include <string>
#include "../message.h"
#include "../../generator.h"

class GetInstancesRequest : public Request {
public:
	std::string name;
	uint32_t count;

	GetInstancesRequest(Buffer& data);

	void Process() override;
};

class GetInstancesResponse : public Response {
public:
	std::vector<std::string> names;

	GetInstancesResponse() : Response(MessageType::GET_INSTANCES) {};
	GetInstancesResponse(std::vector<std::string> names) : names(names), Response(MessageType::GET_INSTANCES) {};

	void Process(Buffer& data) override;
};