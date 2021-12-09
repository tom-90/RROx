#include <windows.h> 
#include <stdio.h>
#include <conio.h>
#include <tchar.h>
#include "pipe.h"

NamedPipe* logger = nullptr;
NamedPipe* communicator = nullptr;

NamedPipe::NamedPipe(std::string pipeName) {
    name = pipeName;
    connect();
}

void NamedPipe::connect() {
    pipe = CreateFile(TEXT("\\\\.\\pipe\\RRO"), GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);
    if (pipe == INVALID_HANDLE_VALUE)
        return;

    ConnectNamedPipe(pipe, NULL);

    WriteString(name);
}

void NamedPipe::WriteString(std::string str) {
  bool fSuccess = WriteFile(pipe, str.c_str(), str.length(), &numWritten, NULL);
  if (!fSuccess) {
      connect();
      WriteFile(pipe, str.c_str(), str.length(), &numWritten, NULL);
  }
}

void NamedPipe::WriteInt(int32_t number) {
    WriteFile(pipe, &number, 4, &numWritten, NULL);
}

void NamedPipe::Close() {
  FlushFileBuffers(pipe);
  CloseHandle(pipe);
}

int32_t NamedPipe::ReadIntOrRecover(std::stop_token stoptoken) {
    int32_t intBuff;
    bool fSuccess;
    do
    {
        fSuccess = ReadFile(pipe, &intBuff, 4, &numRead, NULL);

        if (!fSuccess && GetLastError() != ERROR_MORE_DATA) {
            connect();
        }

    } while (!stoptoken.stop_requested() && !fSuccess);

    return intBuff;
}

int32_t NamedPipe::ReadInt(std::stop_token stoptoken) {
  int32_t intBuff;
  bool fSuccess;
  do
  {
    fSuccess = ReadFile(pipe,&intBuff,4,&numRead,NULL);
  }
  while (!stoptoken.stop_requested() && !fSuccess && GetLastError() != ERROR_MORE_DATA);

  return intBuff;
}

uint64_t NamedPipe::ReadUInt64(std::stop_token stoptoken) {
  uint64_t intBuff;
  bool fSuccess;
  do
  {
    fSuccess = ReadFile(pipe, &intBuff, 8, &numRead, NULL);
  } while (!stoptoken.stop_requested() && !fSuccess && GetLastError() != ERROR_MORE_DATA);

  return intBuff;
}

float NamedPipe::ReadFloat(std::stop_token stoptoken) {
    float floatBuff;
    bool fSuccess;
    do
    {
        fSuccess = ReadFile(pipe, &floatBuff, 4, &numRead, NULL);
    } while (!stoptoken.stop_requested() && !fSuccess && GetLastError() != ERROR_MORE_DATA);

    return floatBuff;
}
