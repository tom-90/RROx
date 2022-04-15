#pragma once
#include <unordered_map>
#include <vector>
#include <string>
#include "./UE425/fname.h"
#include "./UE425/uobjectarray.h"
#include "./wrappers/uobject.h"
#include "injector.h"
#include "generator.h"
#include "./net/messages/log.h"
#include "./net/messages/getdata.h"
#include "./net/messages/getinstances.h"
#include "./net/messages/getstatic.h"
#include "./net/messages/getstruct.h"
#include "./net/messages/getstructlist.h"
#include "./net/messages/ready.h"

size_t FNameEntryAllocator::NumEntries = 0;
std::unordered_map<uint32_t, std::string> FNameEntryAllocator::Cache = {};

bool Injector::load() {
	if (!memory.retrieveSymbol<FUObjectArray>("48 8B 05 * * * * 48 8B 0C C8 48 8D 04 D1 EB", -0x10)) {
		log("Could not find FUObjectArray");
		return false;
	}
	log("Found FUObjectArray address.");

	if (!memory.retrieveSymbol<FNamePool>("48 8D 35 * * * * EB 16")) {
		log("Could not find FNamePool");
		return false;
	}
	log("Found FNamePool address.");

	NamePoolData = memory.getSymbol<FNamePool>();

	ReadyMessage readyMsg;
	readyMsg.Send();

	processMessages();

	return true;
}

void Injector::stop() {
	log("Stopping Injector");
	communicator.Close();
}

void Injector::parseTable() {
	auto namePool = memory.getSymbol<FNamePool>();
	auto objArray = memory.getSymbol<FUObjectArray>();

	if (namePool == nullptr || objArray == nullptr)
		return;

	// Dump all names into the cache
	namePool->Entries.Dump();

	uint32_t GUObjectSize = objArray->ObjObjects.NumChunks;

	log("GUObjectArray\n");

	std::vector<GeneratedFunction> functions;
	std::vector<GeneratedEnum> enums;
	std::vector<GeneratedStruct> structs;

	for (int i = 0; i < objArray->ObjObjects.Num(); i++)
	{
		WUObject object = objArray->ObjObjects.GetObjectPtr(i)->Object;

		if (object.IsA<WUFunction>())
			functions.push_back(GeneratedFunction(object.Cast<WUFunction>()));
		else if (object.IsA<WUStruct>())
			structs.push_back(GeneratedStruct(object.Cast<WUStruct>()));
		else if (object.IsA<WUEnum>())
			enums.push_back(GeneratedEnum(object.Cast<WUEnum>()));
	}

	log("Finished\n");
}

void Injector::log(std::string message) {
	LogMessage msg = LogMessage(message);

	msg.Send();
}

bool Injector::stopRequested() {
	return stopToken.stop_requested();
}

void Injector::processMessages() {
	log("Listening for messages...");
	while (!stopRequested()) {
		if (!communicator.IsConnected()) {
			std::this_thread::sleep_for(std::chrono::milliseconds(10));
			communicator.Connect();

			ReadyMessage readyMsg;
			readyMsg.Send();
		}

		auto sizeBuffer = communicator.Read(sizeof(std::size_t));
		if (sizeBuffer.Size() == 0) {
			std::this_thread::sleep_for(std::chrono::milliseconds(10));
			continue;
		}
		auto size = sizeBuffer.Read<std::size_t>();
		if (size == 0) {
			std::this_thread::sleep_for(std::chrono::milliseconds(10));
			continue;
		}

		auto message = communicator.Read(size);
		MessageType type = message.Read<MessageType>();
		message.SetOffset(0); // Reset read position back to 0

		log("Received message of type " + std::to_string(static_cast<uint16_t>(type)));

		switch (type) {
		case MessageType::GET_STRUCT: {
			GetStructRequest req = GetStructRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		case MessageType::GET_STRUCT_LIST: {
			GetStructListRequest req = GetStructListRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		case MessageType::GET_DATA: {
			GetDataRequest req = GetDataRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		case MessageType::GET_INSTANCES: {
			GetInstancesRequest req = GetInstancesRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		case MessageType::GET_STATIC: {
			GetStaticRequest req = GetStaticRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		}
	}
}

/** Global reference to injector class */
Injector injector;