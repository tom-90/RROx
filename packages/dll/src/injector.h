#pragma once
#include "utils/memory.h"
#include "net/pipe.h"
#include <thread>

class Injector {
public:
	MemoryManager memory;

	std::stop_token stopToken;

	NamedPipe communicator{ "DID" };

	bool load();

	void stop();

	void parseTable();

	bool stopRequested();

	void log(std::string message);

	void processMessages();
};

/** Global reference to injector class */
extern Injector injector;