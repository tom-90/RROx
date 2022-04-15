#pragma once
#include "../message.h"

class ReadyMessage : public Message {
public:
	ReadyMessage();

	void Send();
};