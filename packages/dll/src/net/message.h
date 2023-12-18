#pragma once
#include "buffer.h"
#include "pipe.h"
#include "../injector.h"

enum class MessageType : uint16_t {
	UNKNOWN = 0,
	LOG = 1,
	GET_STRUCT = 2,
	GET_STRUCT_LIST = 3,
	READY = 4,
	GET_DATA = 5,
	GET_INSTANCES = 6,
	GET_STATIC = 7,
	GET_STRUCT_TYPE = 8,
	GET_INSTANCES_MULTI = 9
};

class Message {
public:
	uint16_t id = 0;
	MessageType type = MessageType::UNKNOWN;
};

class Request : public Message {
public:
	Request() {};
	Request(Buffer& data);
	virtual void Process();

	NamedPipe* pipe = nullptr;

	template <typename T>
	void ProcessResponse(T& response);
};

class Response : public Message {
public:
	Response(MessageType type) {
		this->type = type;
	};

	virtual void Process(Buffer& data);
};

template <typename T>
void Request::ProcessResponse(T& response) {
	response.id = id;
	Buffer data;
	response.Process(data);

    // injector.log("DLL: " + std::to_string(data.Size()) + " bytes sending");
    // injector.log("DLL: " + data.ToHex());

	if(pipe)
		pipe->Write(data);
}
