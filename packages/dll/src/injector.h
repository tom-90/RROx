#pragma once
#include "utils/memory.h"
#include "net/pipe.h"
#include <thread>
#include "wrappers/uobjectarray.h"

class Injector {
private:
	MemoryManager memory;
	uint32_t determineVersionOffset();
	void testProcessEventOffset();

public:
	EVersion version;
	WFUObjectArray objectArray;

	std::stop_token stopToken;

	NamedPipe communicator{ "DID" };

	bool load();

	void stop();

	bool stopRequested();

	void log(std::string message);

	void processMessages();
};

/** Global reference to injector class */
extern Injector injector;