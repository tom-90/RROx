#include "log.h"
#include "../../injector.h"

LogMessage::LogMessage(std::string& message) : message(message) {
	this->id = 0;
	this->type = MessageType::LOG;
};

void LogMessage::Send() {
	Buffer data;

	data.Write(type);
	data.Write(id);
	data.Write(message);

	injector.communicator.Write(data);
}