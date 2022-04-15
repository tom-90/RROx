#pragma once
#include "../message.h"
#include "../../generator.h"

class GetDataRequest : public Request {
public:
	std::string name;
	Buffer& data;

	GetDataRequest(Buffer& data);

	void Process() override;
};

class GetDataResponse : public Response {
private:
	Buffer& queryRes;

public:
	GetDataResponse(Buffer& queryRes) : Response(MessageType::GET_DATA), queryRes(queryRes) {};

	void Process(Buffer& data) override;
};