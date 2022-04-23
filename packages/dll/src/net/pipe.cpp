#include "pipe.h"
#include "../injector.h"

NamedPipe::NamedPipe(const std::string pipeName) {
    name = pipeName;
    Connect();
}

void NamedPipe::Connect() {
    pipe = CreateFile(TEXT("\\\\.\\pipe\\RRO"), GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);
    if (pipe == INVALID_HANDLE_VALUE)
        return;

    ConnectNamedPipe(pipe, NULL);

    connected = true;
}

Buffer NamedPipe::Read(std::size_t size) {
    std::vector<std::byte> buffer(size);
    bool fSuccess;
    do
    {
        fSuccess = ReadFile(pipe, buffer.data(), size, &numRead, NULL);
        if (!fSuccess && GetLastError() == ERROR_BROKEN_PIPE)
            connected = false;
    } while (!injector.stopRequested() && !fSuccess && connected);

    return std::move(buffer);
}

void NamedPipe::Write(Buffer& buffer) {
    auto size = buffer.Size();
    bool fSuccess = WriteFile(pipe, &size, sizeof(size), &numWritten, NULL);
    if (!fSuccess) {
        Connect();
        fSuccess = WriteFile(pipe, &size, sizeof(size), &numWritten, NULL);
    }

    if (!fSuccess)
        return;

    fSuccess = WriteFile(pipe, buffer.Data(), buffer.Size(), &numWritten, NULL);
    if (!fSuccess) {
        Connect();
        WriteFile(pipe, buffer.Data(), buffer.Size(), &numWritten, NULL);
    }
}

void NamedPipe::Flush() {
    FlushFileBuffers(pipe);
}

void NamedPipe::Close() {
    Flush();
    CloseHandle(pipe);
}

bool NamedPipe::IsConnected() {
    return connected;
}