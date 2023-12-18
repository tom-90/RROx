#include "query.h"
#include "../UE/base.h"
#include "../UE/v425/uobject.h"
#include "../UE/v425/uobjectarray.h"
#include "../UE/v425/ftext.h"
#include "../wrappers/uobject.h"
#include "../wrappers/fname.h"
#include "../wrappers/ftext.h"

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

		std::byte* ptr = (std::byte*)stackItem.object + stackItem.baseOffset + offset;
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

		UE::TArray<void*>* ptr = (UE::TArray<void*>*)((std::byte*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		// Write complete array length
		response.Write(ptr->Count);

		auto reqOffset = request.GetOffset();

		// Cast ptr->Count to size_t
		size_t size = ptr->Count;
		response.Write(size);

		// Write each item
		for (int i = 0; i < ptr->Count; i++) {
			response.Write(i);

			request.SetOffset(reqOffset);

			void* itemPtr = *(std::byte**)ptr + itemSize * i;

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

		UE::TArray<void*>* ptr = (UE::TArray<void*>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
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

		std::string name = getStackItem<WUObject>().GetFullName();

		response.Write(name);

		return true;
	}
	case QueryCommandTypes::READ_FNAME: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		void* ptr = (void*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr))) {
			response.Write(false);
			return true;
		}

		auto wrapper = getStackItem<WFName>(offset);
		std::string name = wrapper.GetName();

		response.Write(true);
		response.Write(name);
		response.Write(wrapper.GetIndex());
		response.Write(wrapper.GetNumber());

		return true;
	}
	case QueryCommandTypes::READ_FSTRING: {
		if (traversal.empty())
			return false;

		uint32_t offset = request.Read<uint32_t>();

		QueryStackItem& stackItem = traversal.top();

		UE::FString* ptr = (UE::FString*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
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

		void* ptr = (void*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr))) {
			response.Write(false);
			return true;
		}

		auto wrapper = getStackItem<WFText>(offset);
		std::string name = wrapper.ToString();

		response.Write(true);
		response.Write(name);

		return true;
	}
	case QueryCommandTypes::TRAVERSE_GLOBAL: {
		std::string name = request.Read();
		WFUObjectItem item = injector.objectArray.FindObject(name);
		if (item) {
			traversal.push({
				std::visit([](auto&& obj) -> void* { return obj; }, item.GetObject().get()),
				0
			});

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
		void* ptr = (*(void**)addr);

		if (ptr == nullptr) {
			response.Write(false);
			processCommandsNoop();
			return true;
		}

		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		WUObject obj = getForAddress<WUObject>(ptr);

		if (!isValidName(obj, name)) {
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

		UE::TArray<void*>* ptr = (UE::TArray<void*>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
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

		std::byte* ptr = (std::byte*)stackItem.object + stackItem.baseOffset + offset;
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

		UE::TArray<std::byte>* ptr = (UE::TArray<std::byte>*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;
		
		pointers.push_back(std::unique_ptr<std::byte[]>(new std::byte[itemSize * length]));

		ptr->Data = pointers.back().get();
		ptr->Count = length;
		ptr->ArraySize = length;

		for (int i = 0; i < length; i++) {
			traversal.push({ ptr->Data, i * itemSize});

			if (!processCommands())
				return false;

			traversal.pop();
		}

		return true;
	}
	case QueryCommandTypes::WRITE_FSTRING: {
		if (traversal.empty())
			return false;

		QueryStackItem& stackItem = traversal.top();

		uint32_t offset = request.Read<uint32_t>();
		std::string string = request.Read();

		UE::FString* ptr = (UE::FString*)((unsigned char*)stackItem.object + stackItem.baseOffset + offset);
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		std::wstring wstring(string.begin(), string.end());
		const wchar_t* chars = wstring.c_str();
		auto size = wcslen(chars) + 1; // Number of characters + 1 for null pointer

		pointers.push_back(std::unique_ptr<std::byte[]>(new std::byte[sizeof(wchar_t) * size]));
		wchar_t* heapChars = (wchar_t*)pointers.back().get();
		memcpy(heapChars, chars, sizeof(wchar_t) * size);

		ptr->Data = heapChars;
		ptr->Count = size;
		ptr->ArraySize = size;

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

		std::byte* ptr = (std::byte*)stackItem.object + stackItem.baseOffset + offset;
		if (IsBadReadPtr(ptr, sizeof(ptr)))
			return false;

		uint64_t pointer = (uint64_t)storedPointer;

		memcpy(ptr, &pointer, sizeof(storedPointer));

		return true;
	}
	case QueryCommandTypes::EXECUTE_FUNCTION: {
		if (traversal.empty())
			return false;

		WUObject obj = getStackItem<WUObject>();
		
		std::string funcName = request.Read();
		uint32_t size = request.Read<uint32_t>();

		WFUObjectItem item = injector.objectArray.FindObject(funcName);

		if (item) {
			WUFunction func = item.GetObject().Cast<WUFunction>();

			std::vector<std::byte> data;

			data.reserve(size);

			traversal.push({ data.data(), 0 });

			// Commands to write to data
			processCommands();

			obj.ProcessEvent(func, data.data());

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

		return true;
	}
	case QueryCommandTypes::IS_CASTABLE: {
		if (traversal.empty())
			return false;

		std::string name = request.Read();
		WUObject obj = getStackItem<WUObject>();

		if (!isValidName(obj, name)) {
			response.Write(false);
			return true;
		}

		response.Write(true);
		return true;
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
	case QueryCommandTypes::IS_CASTABLE: {
		std::string name = request.Read();
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

bool QueryExecutor::isValidName(WUObject obj, std::string& name) {
	WUObject wrapped = obj;
	std::string nameLowerCase = name;
	std::transform(nameLowerCase.begin(), nameLowerCase.end(), nameLowerCase.begin(), ::tolower);

	std::string wrappedName = wrapped.GetFullName();
	std::transform(wrappedName.begin(), wrappedName.end(), wrappedName.begin(), ::tolower);
	if (wrappedName == nameLowerCase)
		return true;

	WUClass wrappedClass = wrapped.GetClass();
	std::string wrappedClassName = wrappedClass.GetFullName();
	std::transform(wrappedClassName.begin(), wrappedClassName.end(), wrappedClassName.begin(), ::tolower);
	if (wrappedClassName == nameLowerCase)
		return true;

	while (wrappedClass) {
		WUStruct super = wrappedClass.GetSuper();

		if (!super)
			return false;

		std::string superName = super.GetFullName();
		std::transform(superName.begin(), superName.end(), superName.begin(), ::tolower);

		if(superName == nameLowerCase)
			return true;
		if (!super.IsA<WUClass>())
			return false;

		wrappedClass = super.Cast<WUClass>();
	}

	return true;
}

template <class T>
T QueryExecutor::getStackItem() {
	return getStackItem<T>(false, 0);
}

template <class T>
T QueryExecutor::getStackItem(int offset) {
	return getStackItem<T>(true, offset);
}

template <class T>
T QueryExecutor::getStackItem(bool withBaseOffset, int offset) {
	QueryStackItem& stackItem = traversal.top();

	uint64_t addr = (uint64_t)stackItem.object;
	if (withBaseOffset)
		addr += stackItem.baseOffset;

	addr += offset;

	return getForAddress<T>((void*) addr);
}

template <class T>
T QueryExecutor::getForAddress(void* addr) {
	return T{ addr, injector.version };
}