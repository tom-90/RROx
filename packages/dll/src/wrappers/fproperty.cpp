#include "fproperty.h"
#include "../utils/hash.h"

#define CONCAT_(a, b) a##b
#define CONCAT(a, b) CONCAT_(a, b)
#define PROPERTY(Type) std::string CONCAT(CONCAT(WF, Type), Property)::ClassName = "Class CoreUObject."#Type"Property";

// Need to define manually because of the appended Base
std::string WFObjectPropertyBase::ClassName = "Class CoreUObject.ObjectPropertyBase";

PROPERTY(Struct);
PROPERTY(Array);
PROPERTY(Byte);
PROPERTY(Bool);
PROPERTY(Enum);
PROPERTY(Class);
PROPERTY(Set);
PROPERTY(Map);
PROPERTY(Interface);
PROPERTY(FieldPath);

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
PROPERTY(MulticastDelegate);
PROPERTY(WeakObject);

#undef CONCAT_
#undef CONCAT
#undef PROPERTY

PropertyType WFProperty::GetType() {
    if (IsA<WFDoubleProperty>()) return PropertyType::DoubleProperty;
    if (IsA<WFFloatProperty>()) return PropertyType::FloatProperty;
    if (IsA<WFIntProperty>()) return PropertyType::IntProperty;
    if (IsA<WFInt16Property>()) return PropertyType::Int16Property;
    if (IsA<WFInt64Property>()) return PropertyType::Int64Property;
    if (IsA<WFInt8Property>()) return PropertyType::Int8Property;
    if (IsA<WFUInt16Property>()) return PropertyType::UInt16Property;
    if (IsA<WFUInt32Property>()) return PropertyType::UInt32Property;
    if (IsA<WFUInt64Property>()) return PropertyType::UInt64Property;
    if (IsA<WFTextProperty>()) return PropertyType::TextProperty;
    if (IsA<WFStrProperty>()) return PropertyType::StrProperty;
    if (IsA<WFClassProperty>()) return PropertyType::ClassProperty;
    if (IsA<WFStructProperty>()) return PropertyType::StructProperty;
    if (IsA<WFDelegateProperty>()) return PropertyType::DelegateProperty;
    if (IsA<WFMulticastDelegateProperty>()) return PropertyType::MulticastDelegateProperty;
    if (IsA<WFMulticastSparseDelegateProperty>()) return PropertyType::MulticastSparseDelegateProperty;
    if (IsA<WFNameProperty>()) return PropertyType::NameProperty;
    if (IsA<WFBoolProperty>()) return PropertyType::BoolProperty;
    if (IsA<WFByteProperty>()) return PropertyType::ByteProperty;
    if (IsA<WFArrayProperty>()) return PropertyType::ArrayProperty;
    if (IsA<WFEnumProperty>()) return PropertyType::EnumProperty;
    if (IsA<WFSetProperty>()) return PropertyType::SetProperty;
    if (IsA<WFMapProperty>()) return PropertyType::MapProperty;
    if (IsA<WFFieldPathProperty>()) return PropertyType::FieldPathProperty;
    if (IsA<WFInterfaceProperty>()) return PropertyType::InterfaceProperty;
    if (IsA<WFWeakObjectProperty>()) return PropertyType::WeakObjectProperty;
    if (IsA<WFObjectPropertyBase>()) return PropertyType::ObjectProperty;
    if (IsA<WFSoftClassProperty>()) return PropertyType::SoftClassProperty;
    if (IsA<WFSoftObjectProperty>()) return PropertyType::SoftObjectProperty;
    return PropertyType::Unknown;
}

int32_t WFProperty::GetArrayDim() {
    if (!IsValid()) return 0;
    return get()->ArrayDim;
}

int32_t WFProperty::GetSize() {
    if (!IsValid()) return 0;
    return get()->ElementSize;
}

int32_t WFProperty::GetOffset() {
    if (!IsValid()) return 0;
    return get()->Offset_Internal;
}

EPropertyFlags WFProperty::GetPropertyFlags() {
    if (!IsValid()) return EPropertyFlags::CPF_None;
    return get()->PropertyFlags;
}

WUStruct WFStructProperty::GetStruct() {
    if (!IsValid()) return WUStruct();
    return get()->Struct;
}

WUClass WFObjectPropertyBase::GetPropertyClass() {
    if (!IsValid()) return WUClass();
    return get()->PropertyClass;
}

WFProperty WFArrayProperty::GetInner() {
    if (!IsValid()) return WFProperty();
    return get()->Inner;
}

WUEnum WFByteProperty::GetEnum() {
    if (!IsValid()) return WUEnum();
    return get()->Enum;
}

uint8_t WFBoolProperty::GetFieldMask() {
    if (!IsValid()) return 0;
    return get()->FieldMask;
}

WUEnum WFEnumProperty::GetEnum() {
    if (!IsValid()) return WUEnum();
    return get()->Enum;
}

WUClass WFClassProperty::GetMetaClass() {
    if (!IsValid()) return WUClass();
    return get()->MetaClass;
}

WFProperty WFSetProperty::GetElementProp() {
    if (!IsValid()) return WFProperty();
    return get()->ElementProp;
}

WFProperty WFMapProperty::GetKeyProp() {
    if (!IsValid()) return WFProperty();
    return get()->KeyProp;
}

WFProperty WFMapProperty::GetValueProp() {
    if (!IsValid()) return WFProperty();
    return get()->ValueProp;
}

WUClass WFInterfaceProperty::GetInterfaceClass() {
    if (!IsValid()) return WUClass();
    return get()->InterfaceClass;
}

FName WFFieldPathProperty::GetPropertyName() {
    if (!IsValid()) return FName();
    return get()->PropertyClass->Name;
}

WUFunction WFDelegateProperty::GetFunction() {
    if (!IsValid()) return WUFunction();
    return get()->SignatureFunction;
}

WUFunction WFMulticastDelegateProperty::GetFunction() {
    if (!IsValid()) return WUFunction();
    return get()->SignatureFunction;
}

WUClass WFSoftClassProperty::GetMetaClass() {
    if (!IsValid()) return WUClass();
    return get()->MetaClass;
}