#include "fname.h"
#include <Windows.h>
#include <string>

namespace UE425 {

FNamePool* NamePoolData = nullptr;

FNameEntry* FNameEntryAllocator::GetEntry(FNameEntryHandle Handle) const {
	return reinterpret_cast<FNameEntry*>(Blocks[Handle.Block] + Stride * static_cast<uint64_t>(Handle.Offset));
}

uint16_t FNameEntry::Size() {
	uint16_t Bytes = sizeof(FNameEntryHeader) + Header.Len * (Header.bIsWide ? sizeof(wchar_t) : sizeof(char));
	return (Bytes + FNameEntryAllocator::Stride - 1u) & ~(FNameEntryAllocator::Stride - 1u);
}

std::string FNameEntry::ToString() {
	if (IsWide()) {
		std::wstring wbuf;
		wbuf.resize(GetNameLength());
		wbuf.assign(WideName, GetNameLength());
		std::string buf(wbuf.begin(), wbuf.end());
		return buf;
	}
	else
	{
		std::string buf;
		buf.resize(GetNameLength());
		buf.assign(AnsiName, GetNameLength());
		return buf;
	}
}

void FNameEntryAllocator::DumpBlock(uint32_t BlockId, uint32_t BlockSize) const {
	unsigned char* It = Blocks[BlockId];
	unsigned char* End = It + BlockSize - sizeof(FNameEntryHeader);
	FNameEntryHandle EntryHandle = { BlockId, 0 };
	while (It < End)
	{
		FNameEntry* Entry = (FNameEntry*)It;
		if (Entry->GetNameLength()) {
			NumEntries++;
			Cache[EntryHandle] = Entry->ToString();
			EntryHandle.Offset += Entry->Size() / Stride;
			It += Entry->Size();
		}
		else { break; }
	}
}

void FNameEntryAllocator::Dump() const {
	NumEntries = 0;
	for (auto i = 0u; i < CurrentBlock; i++) { DumpBlock(i, Stride * 65536); }
	DumpBlock(CurrentBlock, CurrentByteCursor);
}

size_t FNameEntryAllocator::Num() {
	Dump();
	return NumEntries;
}

std::string FName::GetName()
{
	auto entry = NamePoolData->Entries.GetEntry(Index);

	if (IsBadReadPtr(entry, sizeof(entry))) {
		return "";
	}

	auto name = entry->ToString();
	if (Number > 0)
	{
		name += '_' + std::to_string(Number);
	}
	auto pos = name.rfind('/');
	if (pos != std::string::npos)
	{
		name = name.substr(pos + 1);
	}
	return name;
}

}