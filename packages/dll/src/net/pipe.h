#pragma once
#include <string>
#include <cstdint>
#include <thread>
#include <Windows.h>
#include "buffer.h"

class NamedPipe {
private:
	HANDLE pipe;
	DWORD numWritten;
	DWORD numRead;
	std::string name;
	bool connected = false;

public:
	NamedPipe(const std::string pipeName);

	void Connect();

	void Write(Buffer& buffer);
	Buffer Read(std::size_t size);

	void Flush();
	void Close();
	bool IsConnected();
};
