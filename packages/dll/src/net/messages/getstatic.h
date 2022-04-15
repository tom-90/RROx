#pragma once
#include "../message.h"
#include "../../generator.h"

class GetStaticRequest : public Request {
public:
	std::string name;

	GetStaticRequest(Buffer& data);

	void Process() override;
};

class GetStaticResponse : public Response {
public:
	std::string name;
	
	GetStaticResponse() : Response(MessageType::GET_STATIC) {};
	GetStaticResponse(std::string name) : name(name), Response(MessageType::GET_STATIC) {};

	void Process(Buffer& data) override;
};