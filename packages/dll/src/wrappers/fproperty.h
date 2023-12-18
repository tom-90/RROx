#pragma once
#include <cstdint>
#include "ffield.h"
#include "uobject.h"
#include "../UE/v425/ffield.h"
#include "../UE/v425/fproperty.h"
#include "../utils/hash.h"

#define CONCAT_(a, b) a##b
#define CONCAT(a, b) CONCAT_(a, b)
#define PROPERTY(Type) class CONCAT(CONCAT(WF, Type), Property) : public WFProperty { \
public: \
	using WFProperty::WFProperty;\
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
	UEVariant(EPropertyFlags) GetPropertyFlags();
	PropertyType GetType();

	UEVariant(FProperty*) get() const { return CastVariant<UEType(FProperty*)>(); }
};

class WFStructProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUStruct GetStruct();

	UEVariant(FStructProperty*) get() const { return CastVariant<UEType(FStructProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("StructProperty");
};

class WFObjectPropertyBase : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUClass GetPropertyClass();

	UEVariant(FObjectPropertyBase*) get() const { return CastVariant<UEType(FObjectPropertyBase*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ObjectProperty");
};

class WFArrayProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetInner();

	UEVariant(FArrayProperty*) get() const { return CastVariant<UEType(FArrayProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ArrayProperty");
};

class WFByteProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUEnum GetEnum();

	UEVariant(FByteProperty*) get() const { return CastVariant<UEType(FByteProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ByteProperty");
};

class WFBoolProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	uint8_t GetFieldMask();

	UEVariant(FBoolProperty*) get() const { return CastVariant<UEType(FBoolProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("BoolProperty");
};

class WFEnumProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUEnum GetEnum();

	UEVariant(FEnumProperty*) get() const { return CastVariant<UEType(FEnumProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("EnumProperty");
};

class WFClassProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;
	WUClass GetMetaClass();

	UEVariant(FClassProperty*) get() const { return CastVariant<UEType(FClassProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("ClassProperty");
};

class WFSetProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetElementProp();

	UEVariant(FSetProperty*) get() const { return CastVariant<UEType(FSetProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("SetProperty");
};

class WFMapProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WFProperty GetKeyProp();
	WFProperty GetValueProp();

	UEVariant(FMapProperty*) get() const { return CastVariant<UEType(FMapProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MapProperty");
};

class WFInterfaceProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUClass GetInterfaceClass();

	UEVariant(FInterfaceProperty*) get() const { return CastVariant<UEType(FInterfaceProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("InterfaceProperty");
};

class WFFieldPathProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	UEVariant(FName) GetPropertyName();

	UEVariant(FFieldPathProperty*) get() const { return CastVariant<UEType(FFieldPathProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("FieldPathProperty");
};

class WFDelegateProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUFunction GetFunction();

	UEVariant(FDelegateProperty*) get() const { return CastVariant<UEType(FDelegateProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("DelegateProperty");
};

class WFMulticastDelegateProperty : public WFProperty {
public:
	using WFProperty::WFProperty;
	WUFunction GetFunction();

	UEVariant(FMulticastDelegateProperty*) get() const { return CastVariant<UEType(FMulticastDelegateProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MulticastDelegateProperty");
};

class WFMulticastSparseDelegateProperty : public WFMulticastDelegateProperty {
public:
	using WFMulticastDelegateProperty::WFMulticastDelegateProperty;

	UEVariant(FMulticastSparseDelegateProperty*) get() const { return CastVariant<UEType(FMulticastSparseDelegateProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("MulticastSparseDelegateProperty");
};

class WFWeakObjectProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;

	UEVariant(FWeakObjectProperty*) get() const { return CastVariant<UEType(FWeakObjectProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("WeakObjectProperty");
};

class WFSoftObjectProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;

	UEVariant(FSoftObjectProperty*) get() const { return CastVariant<UEType(FSoftObjectProperty*)>(); }

	static std::string ClassName;
	static constinit const uint64_t Hash = HASH("SoftObjectProperty");
};

class WFSoftClassProperty : public WFObjectPropertyBase {
public:
	using WFObjectPropertyBase::WFObjectPropertyBase;
	WUClass GetMetaClass();

	UEVariant(FSoftClassProperty*) get() const { return CastVariant<UEType(FSoftClassProperty*)>(); }

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