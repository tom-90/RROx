#pragma once
#include <cstdint>
#include <unordered_map>

namespace UE503 {

struct FName {
	uint32_t Index; // 0x00(0x04)
	uint32_t Number; // 0x04(0x04)

	std::string GetName();
};

struct FNameEntryHeader // Size 0x2
{
	uint16_t bIsWide : 1; // 1 bit
	uint16_t LowercaseProbeHash : 5; // 5 bits
	uint16_t Len : 10; // 10 bits
};

struct FNameEntry
{
	struct FNameEntryHeader Header; //0x0 (0x2)
	union {
		char AnsiName[1024];
		wchar_t WideName[1024];
	}; // 0x2
	uint16_t Size();
	std::string ToString();
	bool IsWide() const { return Header.bIsWide; }
	int32_t GetNameLength() const { return Header.Len; }
};

struct FNameEntryHandle
{
	uint32_t Block = 0;
	uint32_t Offset = 0;
	FNameEntryHandle(uint32_t block, uint32_t offset) : Block(block), Offset(offset) {};
	FNameEntryHandle(uint32_t id) : Block(id >> 16), Offset(id & 65535) {};
	operator uint32_t() const { return (Block << 16 | Offset); }
};

struct FNameEntryAllocator
{
private:
	static size_t NumEntries;

public:
	static std::unordered_map<uint32_t, std::string> Cache;
	enum { Stride = alignof(FNameEntry) };
	enum { BlockSizeBytes = Stride * 65536 };

	mutable unsigned char Lock[0x08];
	uint32_t CurrentBlock = 0;
	uint32_t CurrentByteCursor = 0;
	uint8_t* Blocks[8192] = {};

	FNameEntry* GetEntry(FNameEntryHandle Handle) const;
	void DumpBlock(uint32_t BlockId, uint32_t BlockSize) const;
	void Dump() const;
	size_t Num();
};

struct FNamePool
{
	enum { MaxENames = 512 };
	FNameEntryAllocator Entries;
};

extern FNamePool* NamePoolData;

}