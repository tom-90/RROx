#pragma once

template <typename U>
class Wrapper {
protected:
	U* object;
public:
	Wrapper(U* object) : object(object) {}
	Wrapper() : object(nullptr) {}

	bool operator==(const Wrapper<U> obj) const { return obj.object == object; };
	bool operator!=(const Wrapper<U> obj) const { return obj.object != object; };

	operator U* () const { return object; };
	operator bool() const { return object != nullptr; }

	template <typename Base> Base Cast() const { return Base(object); }

	bool IsValid() const { return object != nullptr; }
};