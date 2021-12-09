#pragma once
#include <string>
#include <cstdint>
#include <thread>

class NamedPipe {
private:
  HANDLE pipe;
  DWORD numWritten;
  DWORD numRead;
  std::string name;
  void connect();

public:
  NamedPipe(std::string pipeName);

  void WriteString(std::string str);
  void WriteInt(int32_t num);

  int32_t ReadInt(std::stop_token stoptoken);
  int32_t ReadIntOrRecover(std::stop_token stoptoken);
  uint64_t ReadUInt64(std::stop_token stoptoken);
  float ReadFloat(std::stop_token stoptoken);

  void Close();
};

extern NamedPipe* logger;
extern NamedPipe* communicator;

