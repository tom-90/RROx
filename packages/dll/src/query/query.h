#pragma once
#include <stack>
#include <algorithm>
#include "../injector.h"
#include "../net/buffer.h"
#include "../UE425/uobject.h"

enum class QueryCommandTypes : uint16_t {
    READ_BYTES,
    READ_ARRAY,
    READ_ARRAY_RANGES,
    READ_OBJECT_NAME,
    READ_FNAME,
    READ_FSTRING,
    READ_FTEXT,
    TRAVERSE_GLOBAL,
    TRAVERSE_OBJECT,
    TRAVERSE_ARRAY,
    TRAVERSE_OFFSET,
    FINISH,
    WRITE_BYTES,
    WRITE_ARRAY,
    STORE_POINTER,
    WRITE_POINTER,
    WRITE_FSTRING,
    EXECUTE_FUNCTION,
    IS_CASTABLE
};

struct QueryStackItem {
    void* object;
    uint32_t baseOffset;
};

class QueryExecutor {
private:
	Buffer& request;
	Buffer& response;
    std::stack<QueryStackItem> traversal;
    std::vector<std::unique_ptr<std::byte[]>> pointers;
    void* storedPointer = nullptr;

	bool processCommand(QueryCommandTypes command);
    void processCommandNoop(QueryCommandTypes command);
    void processCommandsNoop();
    std::vector<int> getArrayIndices(int arraySize);
    bool isValidName(UObject* obj, std::string& name);
public:
	QueryExecutor(Buffer& request, Buffer& response) : request(request), response(response) {};

    bool processCommands();
};