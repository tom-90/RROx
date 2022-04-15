#pragma once
#include <unordered_map>
#include <Windows.h>
#include <Psapi.h>
#include "scanner.h"

class MemoryManager {
private:
    std::unordered_map<std::size_t, void*> symbols;

public:
    template <typename T>
    void registerSymbol(T* const addr);

    template <typename T>
    void unregisterSymbol();

    template <typename T>
    T* getSymbol();

    template <typename T>
    bool retrieveSymbol(const std::string& sig, const int offset = 0);

    template <typename T>
    [[nodiscard]] T& readPointer(T* const address);

    [[nodiscard]] uint32_t readInteger(uint32_t* const address);
    [[nodiscard]] uint64_t readQword(uint64_t* const address);
    [[nodiscard]] float readFloat(float* const address);
    [[nodiscard]] double readDouble(double* const address);
    [[nodiscard]] std::string readString(char* const address, const int maxLength);
    [[nodiscard]] std::wstring readWideString(wchar_t* const address, const int maxLength);
};

std::optional<size_t> getModuleSize(HMODULE module);

template <typename T>
void MemoryManager::registerSymbol(T* addr) {
    // Avoid duplicates
    unregisterSymbol<T>();

    symbols[typeid(T).hash_code()] = addr;
}

template <typename T>
void MemoryManager::unregisterSymbol() {
    auto i = symbols.find(typeid(T).hash_code());
    if (i == symbols.end())
        return;
    symbols.erase(i);
}

template <typename T>
T* MemoryManager::getSymbol() {
    auto i = symbols.find(typeid(T).hash_code());
    if (i == symbols.end())
        return nullptr;
    return reinterpret_cast<T*>(i->second);
}

template <typename T>
bool MemoryManager::retrieveSymbol(const std::string& sig, const int offset) {
    auto mod = GetModuleHandle(nullptr);
    auto start = (uintptr_t)mod;
    auto length = getModuleSize(mod).value_or(0);

    if (start == 0 || length == 0)
        return false;

    Scanner s{ sig };

    auto result = s.find(start, length);

    if (!result.has_value())
        return false;

    uintptr_t addr = result.value();

    auto k = 0;
    for (; s.pattern[k] >= 0 && k < s.pattern.size(); k++);
    addr = addr + k + 4 + *reinterpret_cast<int*>(addr + k) + offset;

    registerSymbol(reinterpret_cast<T*>(addr));
    return true;
}