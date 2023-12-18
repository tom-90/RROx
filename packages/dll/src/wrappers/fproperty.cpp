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

int32_t WFProperty::GetArrayDim() UEAccessor(ArrayDim);
int32_t WFProperty::GetSize() UEAccessor(ElementSize);
int32_t WFProperty::GetOffset() UEAccessor(Offset_Internal);
UEVariant(EPropertyFlags) WFProperty::GetPropertyFlags() UEAccessorT(PropertyFlags, UEVariant(EPropertyFlags));
WUStruct WFStructProperty::GetStruct() UEAccessorT(Struct, WUStruct);
WUClass WFObjectPropertyBase::GetPropertyClass() UEAccessorT(PropertyClass, WUClass);
WFProperty WFArrayProperty::GetInner() UEAccessorT(Inner, WFProperty);
WUEnum WFByteProperty::GetEnum() UEAccessorT(Enum, WUEnum);
uint8_t WFBoolProperty::GetFieldMask() UEAccessor(FieldMask);
WUEnum WFEnumProperty::GetEnum() UEAccessorT(Enum, WUEnum);
WUClass WFClassProperty::GetMetaClass() UEAccessorT(MetaClass, WUClass);
WFProperty WFSetProperty::GetElementProp() UEAccessorT(ElementProp, WFProperty);
WFProperty WFMapProperty::GetKeyProp() UEAccessorT(KeyProp, WFProperty);
WFProperty WFMapProperty::GetValueProp() UEAccessorT(ValueProp, WFProperty);
WUClass WFInterfaceProperty::GetInterfaceClass() UEAccessorT(InterfaceClass, WUClass);
UEVariant(FName) WFFieldPathProperty::GetPropertyName() UEAccessorT(PropertyClass->Name, UEVariant(FName));
WUFunction WFDelegateProperty::GetFunction() UEAccessorT(SignatureFunction, WUFunction);
WUFunction WFMulticastDelegateProperty::GetFunction() UEAccessorT(SignatureFunction, WUFunction);
WUClass WFSoftClassProperty::GetMetaClass() UEAccessorT(MetaClass, WUClass);