#pragma once
#include <unordered_map>
#include <vector>
#include <string>
#include "./UE/v425/fname.h"
#include "./UE/v425/uobjectarray.h"
#include "./UE/v503/fname.h"
#include "./UE/v503/uobjectarray.h"
#include "./wrappers/uobject.h"
#include "injector.h"
#include "generator.h"
#include "./net/messages/log.h"
#include "./net/messages/getdata.h"
#include "./net/messages/getinstances.h"
#include "./net/messages/getstatic.h"
#include "./net/messages/getstruct.h"
#include "./net/messages/getstructlist.h"
#include "./net/messages/getstructtype.h"
#include "./net/messages/getinstancesmulti.h"
#include "./net/messages/ready.h"

size_t UE425::FNameEntryAllocator::NumEntries = 0;
std::unordered_map<uint32_t, std::string> UE425::FNameEntryAllocator::Cache = {};
size_t UE503::FNameEntryAllocator::NumEntries = 0;
std::unordered_map<uint32_t, std::string> UE503::FNameEntryAllocator::Cache = {};

bool Injector::load() {
	if(
		memory.retrieveSymbol<UE425::FUObjectArray>("48 8B 05 * * * * 48 8B 0C C8 48 8D 04 D1 EB", -0x10) &&
		memory.retrieveSymbol<UE425::FNamePool>("48 8D 35 * * * * EB 16")
	) {
		// Loaded FUObjectArray and FNamePool for either UE425 or UE500
		log("Found FUObjectArray and FNamePool address for either UE425 or UE500.");

		objectArray.load(memory.getSymbol<UE425::FUObjectArray>());
		UE425::NamePoolData = memory.getSymbol<UE425::FNamePool>();

		uint32_t version_offset = determineVersionOffset();

		if (version_offset == 0xA4) {
			log("Determined engine is UE425");
			version = EVersion::UE425;
			UE425::UObjectProcessEventOffset = 0x42;
		}
		else {
			log("Determined engine is UE500");
			version = EVersion::UE500;
			UE425::UObjectProcessEventOffset = 0x4B;
		}
	} else if(
		memory.retrieveSymbol<UE503::FUObjectArray>("48 8B 05 * * * * 48 8B 0C C8 48 8D 04 D1 EB", -0x10) &&
		memory.retrieveSymbol<UE503::FNamePool>("48 8D 15 * * * * EB 16 48 8D 0D")
	) {
		// Loaded FUObjectArray and FNamePool for either UE425 or UE500
		log("Found FUObjectArray and FNamePool address.");
		log("Determined engine is UE503");
		version = EVersion::UE503;

		objectArray.load(memory.getSymbol<UE503::FUObjectArray>());
		UE503::NamePoolData = memory.getSymbol<UE503::FNamePool>();

	} else {
		log("Could not find FUObjectArray and FNamePool address.");
		return false;
	}

	ReadyMessage readyMsg;
	readyMsg.Send();

	processMessages();

	return true;
}

void Injector::stop() {
	log("Stopping Injector");
	communicator.Close();
}

uint32_t Injector::determineVersionOffset() {
	auto item = objectArray.FindObject("Class Engine.GameUserSettings");
	if (!item)
		return -1;

	int32_t version_offset = 0;

	WUObject wrapped = item.GetObject();
	if (wrapped.IsA<WUStruct>()) {
		WUStruct wrapped_struct = wrapped.Cast<WUStruct>();
		for (auto prop = wrapped_struct.GetChildProperties().Cast<WFProperty>(); prop; prop = prop.GetNext().Cast<WFProperty>()) {
			if (prop.GetName() == "Version") {
				version_offset = prop.GetOffset();
				break;
			}
		}
	}

	// Tried to distinguish between version values, but turns out, even in UE4, version = 5 (at least in current RailroadsOnline)
	// But turns out the offset is different, so that works :)
	return version_offset;
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

		//log("Received message of type " + std::to_string(static_cast<uint16_t>(type)));

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
		case MessageType::GET_STRUCT_TYPE: {
			GetStructTypeRequest req = GetStructTypeRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		case MessageType::GET_INSTANCES_MULTI: {
			GetInstancesMultiRequest req = GetInstancesMultiRequest(message);
			req.pipe = &communicator;
			req.Process();
			break;
		}
		}
	}
}

/** Global reference to injector class */
Injector injector;