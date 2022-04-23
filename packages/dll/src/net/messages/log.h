#pragma once
#include "../message.h"

class LogMessage : public Message {
public:
	LogMessage(std::string& message);

	std::string message;

	void Send();
};