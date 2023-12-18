#include "buffer.h"

bool Buffer::HasNext(std::size_t size) {
	return position + size <= data.size();
}

std::string Buffer::Read() {
	std::size_t size = Read<std::size_t>();
	std::string str(size, '0');
	Read(str.data(), size);
	return str;
}

void Buffer::Write(Buffer& buffer) {
	data.insert(data.end(), buffer.data.begin(), buffer.data.end());
}

void Buffer::Write(std::string str) {
	Write(str.size());
	Write(str.c_str(), str.size());
}

std::byte* Buffer::Data() {
	return data.data();
}

std::size_t Buffer::Size() {
	return data.size();
}

std::size_t Buffer::GetOffset() {
	return position;
}

bool Buffer::SetOffset(std::size_t offset) {
	if (offset >= data.size())
		return false;
	position = offset;
	return true;
}

bool Buffer::Skip(std::size_t offset) {
	return SetOffset(GetOffset() + offset);
}

std::string Buffer::ToHex() {
	std::string hex;

	for (auto& byte : data) {
		char buf[3];
		sprintf_s(buf, "%02X", static_cast<uint8_t>(byte));
		hex += buf;
	}

	return hex;
}