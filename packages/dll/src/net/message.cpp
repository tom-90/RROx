#include "message.h"

Request::Request(Buffer& data) {
	type = data.Read<MessageType>();
	id = data.Read<uint16_t>();
}

void Request::Process() {};

void Response::Process(Buffer& data) {
	data.Write(type);
	data.Write(id);
};