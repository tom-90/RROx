#include "ready.h"
#include "../../injector.h"

ReadyMessage::ReadyMessage() {
	this->id = 0;
	this->type = MessageType::READY;
};

void ReadyMessage::Send() {
	Buffer data;

	data.Write(type);
	data.Write(id);

	injector.communicator.Write(data);
}