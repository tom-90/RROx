#pragma once
#pragma once
#include <string>
#include "../message.h"
#include "../../generator.h"

class GetInstancesMultiRequest : public Request {
public:
	std::vector<std::string> names;
	uint32_t count;
	bool deep;

	GetInstancesMultiRequest(Buffer& data);

	void Process() override;
};

class GetInstancesMultiResponse : public Response {
public:
	std::vector<std::tuple<uint32_t, std::string>> data;

	GetInstancesMultiResponse() : Response(MessageType::GET_INSTANCES_MULTI) {};
	GetInstancesMultiResponse(std::vector<std::tuple<uint32_t, std::string>> data) : data(data), Response(MessageType::GET_INSTANCES_MULTI) {};

	void Process(Buffer& data) override;
};