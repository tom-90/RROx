#include "memory.h"
#include <stdexcept>
#include <typeinfo>

template <typename T>
T& MemoryManager::readPointer(T* address) {
    if (IsBadReadPtr(address, sizeof(T)))
        throw std::runtime_error("Tried to read invalid pointer: " + std::string(typeid(T).name()));
    return *address;
}

uint32_t MemoryManager::readInteger(uint32_t* address) {
    return readPointer(address);
}

uint64_t MemoryManager::readQword(uint64_t* address) {
    return readPointer(address);
}

float MemoryManager::readFloat(float* address) {
    return readPointer(address);
}

double MemoryManager::readDouble(double* address) {
    return readPointer(address);
}

std::string MemoryManager::readString(char* address, int maxLength) {
    std::string str;
    if (address == 0)
        return str;

    char C;
    for (int i = 0; i < maxLength; i++) {
        C = *(char*)address + i * 2;
        if ((int)C == 0)
            break;
        str.push_back(C);
    }
    return str;
}

std::wstring MemoryManager::readWideString(wchar_t* address, int maxLength) {
    std::wstring str;
    if (address == 0)
        return str;

    wchar_t C;
    for (int i = 0; i < maxLength; i++) {
        C = *(wchar_t*)address + i * 2;
        if ((int)C == 0)
            break;
        str.push_back(C);
    }
    return str;
}

std::optional<size_t> getModuleSize(HMODULE module) {
    if (module == nullptr) {
        return {};
    }

    // Get the dos header and verify that it seems valid.
    auto dosHeader = (PIMAGE_DOS_HEADER)module;

    if (dosHeader->e_magic != IMAGE_DOS_SIGNATURE) {
        return {};
    }

    // Get the nt headers and verify that they seem valid.
    auto ntHeaders = (PIMAGE_NT_HEADERS)((uintptr_t)dosHeader + dosHeader->e_lfanew);

    if (ntHeaders->Signature != IMAGE_NT_SIGNATURE) {
        return {};
    }

    // OptionalHeader is not actually optional.
    return ntHeaders->OptionalHeader.SizeOfImage;
}