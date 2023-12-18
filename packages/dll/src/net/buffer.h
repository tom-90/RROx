#pragma once
#include <vector>
#include <cstdint>
#include <string>

class Buffer {
private:
	std::vector<std::byte> data;
	std::size_t position = 0;
public:
	Buffer(const std::vector<std::byte>& d) : data(d) {};
	Buffer(std::vector<std::byte>&& d) : data(std::move(d)) {};
	Buffer() : data(std::vector<std::byte>()) {};

	bool HasNext(std::size_t size);

	template <typename T>
	bool HasNext();

	std::string Read();

	template <typename T>
	void Read(T* data, std::size_t size = sizeof(T));

	template <typename T>
	T Read();

	void Write(Buffer& buffer);

	void Write(std::string str);

	template <typename T>
	void Write(T data, std::size_t size = sizeof(T));

	template <typename T>
	void Write(T* data, std::size_t size = sizeof(T));

	std::size_t GetOffset();
	bool SetOffset(std::size_t offset);
	bool Skip(std::size_t offset);

	std::byte* Data();
	std::size_t Size();
	std::string ToHex();
};

template <typename T>
void Buffer::Write(T var, std::size_t size) {
	std::byte const* bytes = reinterpret_cast<std::byte const*>(&var);

	for (std::size_t i = 0; i != size; i++)
		data.push_back(bytes[i]);
}

template <typename T>
void Buffer::Write(T* var, std::size_t size) {
	std::byte const* bytes = reinterpret_cast<std::byte const*>(var);

	for (std::size_t i = 0; i != size; i++)
		data.push_back(bytes[i]);
}

template <typename T>
void Buffer::Read(T* var, std::size_t size) {
	if (!HasNext(size))
		return;
	memcpy(var, &data[position], size);
	position += size;
}

template <typename T>
T Buffer::Read() {
	T var;
	Read(&var, sizeof(var));
	return var;
}

template <typename T>
bool Buffer::HasNext() {
	return HasNext(sizeof(T));
}