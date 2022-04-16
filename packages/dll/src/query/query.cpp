#include "query.h"
#include "../UE425/base.h"
#include "../UE425/uobject.h"
#include "../UE425/uobjectarray.h"
#include "../UE425/ftext.h"
#include "../wrappers/uobject.h"

bool QueryExecutor::processCommands() {
	QueryCommandTypes command = request.Read<QueryCommandTypes>();

	while (command != QueryCommandTypes::FINISH) {
		bool res = processCommand(command);

		if (!res)
			return false;

		if (request.HasNext<QueryCommandTypes>()) {
			command = request.Read<QueryCommandTypes>();
		}
		else {
			command = QueryCommandTypes::FINISH;
		}
	}

	return true;
}

bool QueryExecutor::processCommand(QueryCommandTypes command) {
	switch (command) {
	case QueryCommandTypes::READ_BYTES: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();
		uint32_t length = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		std::byte* ptr = (std::byte*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		response.Write(ptr, length);

		return true;
	}
	case QueryCommandTypes::READ_ARRAY: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();
		uint32_t itemSize = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		TArray<void*>* ptr = (TArray<void*>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		// Write complete array length
		response.Write(ptr->Count);

		auto reqOffset = request.GetOffset();

		// Write each item
		std::size_t size = 0;
		size += static_cast<uint32_t>(ptr->Count);
		response.Write(size);


		for (int i = 0; i < ptr->Count; i++) {
			response.Write(i);

			request.SetOffset(reqOffset);

			void* itemPtr = *(unsigned char**)ptr + itemSize * i;

			traversal.push({ itemPtr, 0 });

			if (!processCommands())
				return false;

			traversal.pop();
		}

		// If the array length is 0, then we need to increment the request offset without performing any actions
		if (ptr->Count == 0)
			processCommandsNoop();

		return true;
	}
	case QueryCommandTypes::READ_ARRAY_RANGES: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();
		uint32_t itemSize = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		TArray<void*>* ptr = (TArray<void*>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		std::vector<int> indices = getArrayIndices(ptr->Count);

		// Write complete array length
		response.Write(ptr->Count);

		auto reqOffset = request.GetOffset();

		// Write each item
		response.Write(indices.size());
		for (int i = 0; i < ptr->Count; i++) {
			if (std::find(indices.begin(), indices.end(), i) == indices.end())
				continue;

			response.Write(i);

			request.SetOffset(reqOffset);

			void* itemPtr = *(unsigned char**)ptr + itemSize * i;

			traversal.push({ itemPtr, 0 });

			if (!processCommands())
				return false;

			traversal.pop();
		}

		// If the array length is 0, then we need to increment the request offset without performing any actions
		if (ptr->Count == 0)
			processCommandsNoop();

		return true;
	}
	case QueryCommandTypes::READ_OBJECT_NAME: {
		if (traversal.empty())
			return false;

		UObject* obj = (UObject*)traversal.top().object;
		std::string name = obj->GetFullName();

		response.Write(name);

		return true;
	}
	case QueryCommandTypes::READ_FNAME: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		FName* ptr = (FName*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr))) {
			response.Write(false);
			return true;
		}

		std::string name = ptr->GetName();

		response.Write(true);
		response.Write(name);
		response.Write(ptr->Index);
		response.Write(ptr->Number);

		return true;
	}
	case QueryCommandTypes::READ_FSTRING: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		FString* ptr = (FString*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr))) {
			response.Write(false);
			return true;
		}

		std::string name = ptr->ToString();

		response.Write(true);
		response.Write(name);

		return true;
	}
	case QueryCommandTypes::READ_FTEXT: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		FText* ptr = (FText*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr))) {
			response.Write(false);
			return true;
		}

		std::string name = ptr->ToString();

		response.Write(true);
		response.Write(name);

		return true;
	}
	case QueryCommandTypes::TRAVERSE_GLOBAL: {
		std::string name = request.Read();
		FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(name);
		if (item && item->Object) {
			traversal.push({ item->Object, 0 });

			response.Write(true);

			processCommands();

			traversal.pop();
		}
		else {
			response.Write(false);
			processCommandsNoop();
		}

		return true;
	}
	case QueryCommandTypes::TRAVERSE_OBJECT: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();
		std::string name = request.Read();

		QueryStackItem& stackItem = traversal.top();

		uint64_t addr = (uint64_t)stackItem.object;
		addr += stackItem.baseOffset + offset;
		UObject* ptr = (*(UObject**)addr);

		if (ptr == nullptr) {
			response.Write(false);
			processCommandsNoop();
			return true;
		}

		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		if (!isValidName(ptr, name)) {
			response.Write(false);
			processCommandsNoop();
			return true;
		}

		traversal.push({ ptr, 0 });

		response.Write(true);

		processCommands();

		traversal.pop();

		return true;
	}
	case QueryCommandTypes::TRAVERSE_ARRAY: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();
		uint32_t index = request.Read<uint32_t>();
		uint32_t itemSize = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		TArray<void*>* ptr = (TArray<void*>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		if (ptr->Count <= index) {
			response.Write(false);
			processCommandsNoop();
			return true;
		}

		void* itemPtr = *(unsigned char**)ptr + itemSize * index;

		traversal.push({ itemPtr, 0 });

		response.Write(true);

		processCommands();

		traversal.pop();

		return true;
	}
	case QueryCommandTypes::TRAVERSE_OFFSET: {
		if (traversal.empty())
			return false;

		uint32_t baseOffset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();
		
		traversal.push({ stackItem.object, stackItem.baseOffset + baseOffset });

		processCommands();

		traversal.pop();

		return true;
	}
	case QueryCommandTypes::WRITE_BYTES: {
		if (traversal.empty())
			return false;

		QueryStackItem& stackItem = traversal.top();

		uint32_t offset = request.Read<uint32_t>();
		uint32_t length = request.Read<uint32_t>();

		std::vector<std::byte> data;
		for (uint32_t i = 0; i < length; i++)
			data.push_back(request.Read<std::byte>());

		std::byte* ptr = (std::byte*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		memcpy(ptr, data.data(), length);

		return true;
	}
	case QueryCommandTypes::WRITE_ARRAY: {
		if (traversal.empty())
			return false;

		QueryStackItem& stackItem = traversal.top();

		uint32_t offset = request.Read<uint32_t>();
		uint32_t itemSize = request.Read<uint32_t>();
		uint32_t length = request.Read<uint32_t>();

		TArray<std::byte>* ptr = (TArray<std::byte>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		std::unique_ptr<std::byte[]> arr(new std::byte[itemSize * length]);
		pointers.push_back(std::move(arr));

		ptr->Data = arr.get();
		ptr->Count = length;
		ptr->ArraySize = length;

		for (int i = 0; i < length; i++) {
			traversal.push({ arr.get(), i * itemSize});

			if (!processCommands())
				return false;

			traversal.pop();
		}

		return true;
	}
	case QueryCommandTypes::STORE_POINTER: {
		if (traversal.empty())
			return false;

		QueryStackItem& stackItem = traversal.top();

		storedPointer = stackItem.object;

		return true;
	}
	case QueryCommandTypes::WRITE_POINTER: {
		if (traversal.empty())
			return false;

		QueryStackItem& stackItem = traversal.top();

		uint32_t offset = request.Read<uint32_t>();

		std::byte* ptr = (std::byte*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		uint64_t pointer = (uint64_t)storedPointer;

		memcpy(ptr, &pointer, sizeof(storedPointer));

		return true;
	}
	case QueryCommandTypes::EXECUTE_FUNCTION: {
		if (traversal.empty())
			return false;

		UObject* obj = (UObject*)traversal.top().object;
		
		std::string funcName = request.Read();
		uint32_t size = request.Read<uint32_t>();

		FUObjectItem* item = injector.memory.getSymbol<FUObjectArray>()->FindObject(funcName);

		if (item && item->Object) {
			UFunction* func = (UFunction*)item->Object;

			std::vector<std::byte> data;

			data.reserve(size);

			traversal.push({ data.data(), 0 });

			// Commands to write to data
			processCommands();

			obj->ProcessEvent(func, data.data());

			response.Write(true);

			// Commands to read from data
			processCommands();

			traversal.pop();
		}
		else {
			response.Write(false);
			processCommandsNoop();
			processCommandsNoop();
		}

		break;
	}
	}

	return false;
}


void QueryExecutor::processCommandsNoop() {
	QueryCommandTypes command = request.Read<QueryCommandTypes>();

	while (command != QueryCommandTypes::FINISH) {
		processCommandNoop(command);

		if (request.HasNext<QueryCommandTypes>()) {
			command = request.Read<QueryCommandTypes>();
		}
		else {
			command = QueryCommandTypes::FINISH;
		}
	}
}

void QueryExecutor::processCommandNoop(QueryCommandTypes command) {
	switch (command) {
	case QueryCommandTypes::READ_BYTES: {
		request.Read<uint32_t>();
		request.Read<uint32_t>();
		break;
	}
	case QueryCommandTypes::READ_ARRAY: {
		request.Read<uint32_t>();
		request.Read<uint32_t>();
		processCommandsNoop();
		break;
	}
	case QueryCommandTypes::READ_ARRAY_RANGES: {
		request.Read<uint32_t>();
		request.Read<uint32_t>();
		getArrayIndices(0);
		processCommandsNoop();
		break;
	}
	case QueryCommandTypes::READ_OBJECT_NAME: {
		break;
	}
	case QueryCommandTypes::READ_FNAME: {
		uint32_t offset = request.Read<uint32_t>();
		break;
	}
	case QueryCommandTypes::READ_FSTRING: {
		uint32_t offset = request.Read<uint32_t>();
		break;
	}
	case QueryCommandTypes::READ_FTEXT: {
		uint32_t offset = request.Read<uint32_t>();
		break;
	}
	case QueryCommandTypes::TRAVERSE_GLOBAL: {
		std::string name = request.Read();
		break;
	}
	case QueryCommandTypes::TRAVERSE_OBJECT: {
		request.Read<uint32_t>();
		std::string name = request.Read();
		processCommandsNoop();
		break;
	}
	case QueryCommandTypes::TRAVERSE_ARRAY: {
		uint32_t offset = request.Read<uint32_t>();
		uint32_t index = request.Read<uint32_t>();
		uint32_t itemSize = request.Read<uint32_t>();
		processCommandsNoop();
		break;
	}
	case QueryCommandTypes::TRAVERSE_OFFSET: {
		uint32_t baseOffset = request.Read<uint32_t>();
		processCommandsNoop();
		break;
	}
	case QueryCommandTypes::WRITE_BYTES: {
		request.Read<uint32_t>();
		auto length = request.Read<uint32_t>();
		request.Skip(length);
		break;
	}
	case QueryCommandTypes::WRITE_ARRAY: {
		request.Read<uint32_t>();
		request.Read<uint32_t>();
		auto length = request.Read<uint32_t>();
		for (uint32_t i = 0; i < length; i++)
			processCommandsNoop();
		break;
	}
	case QueryCommandTypes::STORE_POINTER: {
		break;
	}
	case QueryCommandTypes::WRITE_POINTER: {
		request.Read<uint32_t>();
		break;
	}
	case QueryCommandTypes::EXECUTE_FUNCTION: {
		std::string name = request.Read();
		request.Read<uint32_t>();
		processCommandsNoop();
		processCommandsNoop();
		break;
	}
	}
}

std::vector<int> QueryExecutor::getArrayIndices(int arraySize) {
	std::vector<int> indices;

	uint64_t rangeCount = request.Read<uint64_t>();
	for (uint64_t i = 0; i < rangeCount; i++) {
		int start = request.Read<int>();
		int end = request.Read<int>();

		if (start < 0)
			start += arraySize;
		if (end < 0)
			end += arraySize;

		if (start < 0 || end < 0)
			continue;

		for (int i = start; i <= end && i < arraySize; i++)
			indices.push_back(i);
	}

	indices.erase(std::unique(indices.begin(), indices.end()), indices.end());

	return indices;
}

bool QueryExecutor::isValidName(UObject* obj, std::string& name) {
	WUObject wrapped = obj;

	if (wrapped.GetFullName() == name)
		return true;

	WUClass wrappedClass = wrapped.GetClass();
	if (wrappedClass.GetFullName() == name)
		return true;

	while (wrappedClass) {
		WUStruct super = wrappedClass.GetSuper();

		if (!super)
			return false;

		if(super.GetFullName() == name)
			return true;
		if (!super.IsA<WUClass>())
			return false;

		wrappedClass = super.Cast<WUClass>();
	}

	return true;
}