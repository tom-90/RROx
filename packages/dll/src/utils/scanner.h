#pragma once
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

class Scanner {
public:
    Scanner() = delete;
    Scanner(const Scanner& other) = default;
    Scanner(Scanner&& other) = default;
    Scanner(const std::string& pattern);
    ~Scanner() = default;

    std::optional<uintptr_t> find(uintptr_t start, size_t length, bool scanCodeOnly = true);

    Scanner& operator=(const Scanner& other) = default;
    Scanner& operator=(Scanner&& other) = default;

    std::vector<int16_t> pattern;

private:
    bool isGoodPtr(uintptr_t ptr, size_t len, bool codeOnly);
    std::vector<int16_t> buildPattern(std::string patternStr);
};