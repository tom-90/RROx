#pragma once
#include <cstdint>
#include "ffield.h"
#include "uobject.h"
#include "../UE425/ffield.h"
#include "../UE425/fproperty.h"
#include "../utils/hash.h"

#define CONCAT_(a, b) a##b
#define CONCAT(a, b) CONCAT_(a, b)
#define PROPERTY(Type) class CONCAT(CONCAT(WF, Type), Property) : public WFProperty { \
public: \
	using WFProperty::WFProperty;\
	CONCAT(CONCAT(WF, Type), Property)* get() { return reinterpret_cast<CONCAT(CONCAT(WF, Type), Property)*>(object); } \
	static std::string ClassName; \
	static constinit const uint64_t Hash = HASH(#Type"Property"); \
};

enum class PropertyType {
	Unknown,
	StructProperty,
	ObjectProperty,
	SoftObjectProperty,
	FloatProperty,
	ByteProperty,
	BoolProperty,
	IntProperty,
	Int8Property,
	Int16Property,
	Int64Property,
	UInt16Property,
	UInt32Property,
	UInt64Property,
	NameProperty,
	DelegateProperty,
	SetProperty,
	ArrayProperty,
	WeakObjectProperty,
	StrProperty,
	TextProperty,
	MulticastSparseDelegateProperty,
	EnumProperty,
	DoubleProperty,
	MulticastDelegateProperty,
	ClassProperty,
	MapProperty,
	InterfaceProperty,
	FieldPathProperty,
	SoftClassProperty
};

class WFProperty : public WFField {
public:
	using WFField::WFField;
	int32_t GetArrayDim();
	int32_t GetSize();
	int32_t GetOffset();
	EPropertyFlags GetPropertyFlags();
	PropertyType GetType();

	FProperty* get() { return reinterpret_cast<FProperty*>(object); }
};

class WFStructProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUStruct GetStruct();

	FStructProperty* get() { return reinterpret_cast<FStructProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("StructProperty");
};

class WFObjectPropertyBase : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUClass GetPropertyClass();

	FObjectPropertyBase* get() { return reinterpret_cast<FObjectPropertyBase*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ObjectProperty");
};

class WFArrayProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetInner();

	FArrayProperty* get() { return reinterpret_cast<FArrayProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ArrayProperty");
};

class WFByteProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUEnum GetEnum();

	FByteProperty* get() { return reinterpret_cast<FByteProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ByteProperty");
};

class WFBoolProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	uint8_t GetFieldMask();

	FBoolProperty* get() { return reinterpret_cast<FBoolProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("BoolProperty");
};

class WFEnumProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUEnum GetEnum();

	FEnumProperty* get() { return reinterpret_cast<FEnumProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("EnumProperty");
};

class WFClassProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;
	WUClass GetMetaClass();

	FClassProperty* get() { return reinterpret_cast<FClassProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ClassProperty");
};

class WFSetProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetElementProp();

	FSetProperty* get() { return reinterpret_cast<FSetProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("SetProperty");
};

class WFMapProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetKeyProp();
	WFProperty GetValueProp();

	FMapProperty* get() { return reinterpret_cast<FMapProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MapProperty");
};

class WFInterfaceProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUClass GetInterfaceClass();

	FInterfaceProperty* get() { return reinterpret_cast<FInterfaceProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("InterfaceProperty");
};

class WFFieldPathProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	FName GetPropertyName();

	FFieldPathProperty* get() { return reinterpret_cast<FFieldPathProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("FieldPathProperty");
};

class WFDelegateProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUFunction GetFunction();

	FDelegateProperty* get() { return reinterpret_cast<FDelegateProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("DelegateProperty");
};

class WFMulticastDelegateProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUFunction GetFunction();

	FMulticastDelegateProperty* get() { return reinterpret_cast<FMulticastDelegateProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MulticastDelegateProperty");
};

class WFMulticastSparseDelegateProperty : public WFMulticastDelegateProperty {
public:
	using WFMulticastDelegateProperty::WFMulticastDelegateProperty;

	FMulticastSparseDelegateProperty* get() { return reinterpret_cast<FMulticastSparseDelegateProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MulticastSparseDelegateProperty");
};

class WFWeakObjectProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;

	FSoftObjectProperty* get() { return reinterpret_cast<FSoftObjectProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("WeakObjectProperty");
};

class WFSoftObjectProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;

	FSoftObjectProperty* get() { return reinterpret_cast<FSoftObjectProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("SoftObjectProperty");
};

class WFSoftClassProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;
	WUClass GetMetaClass();

	FSoftClassProperty* get() { return reinterpret_cast<FSoftClassProperty*>(object); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("SoftClassProperty");
};

// Simple properties

PROPERTY(Double);
PROPERTY(Float);
PROPERTY(Int);
PROPERTY(Int16);
PROPERTY(Int64);
PROPERTY(Int8);
PROPERTY(UInt16);
PROPERTY(UInt32);
PROPERTY(UInt64);
PROPERTY(Text);
PROPERTY(Str);
PROPERTY(Name);

#undef CONCAT_
#undef CONCAT
#undef PROPERTY