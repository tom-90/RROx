#include "generator.h"
#include "injector.h"

GeneratedStruct::GeneratedStruct(WUStruct object) {
    Size = object.GetSize();
    if (Size == 0)
        return;

    FullName = object.GetFullName();
    CppName = object.GetCppName();
    IsClass = object.IsA<WUClass>();

    auto super = object.GetSuper();
    if (super) {
        Inherited = super.GetSize();
        SuperName = super.GetFullName();
    } else
        Inherited = 0;

    uint32_t offset = Inherited;
    uint8_t bitOffset = 0;

    for (auto prop = object.GetChildProperties().Cast<WFProperty>(); prop; prop = prop.GetNext().Cast<WFProperty>())
        Members.push_back(GeneratedMember(prop));

    for (auto child = object.GetChildren(); child; child = child.GetNext())
        if (child.IsA<WUFunction>())
            Functions.push_back(GeneratedFunction(child.Cast<WUFunction>()));
}

void GeneratedStruct::Serialize(Buffer& data) {
    data.Write(FullName);
    data.Write(CppName);
    data.Write(SuperName);
    data.Write(IsClass);
    data.Write(Size);

    // Write members
    data.Write(Members.size());
    for (auto& member : Members)
        member.Serialize(data);

    // Write functions
    data.Write(Functions.size());
    for (auto& function : Functions)
        function.Serialize(data);
}

GeneratedMember::GeneratedMember(WFProperty prop) : prop(prop) {
    ArrayDim = prop.GetArrayDim();
    Size = prop.GetSize() * ArrayDim;
    if (Size == 0)
        return;

    Type = prop.GetType();
    Name = prop.GetName();
    Offset = prop.GetOffset();
    PropertyFlags = prop.GetPropertyFlags();
}

void GeneratedMember::Serialize(Buffer& data) {
    data.Write(Type);
    data.Write(Name);
    data.Write(Offset);
    data.Write(Size);
    std::visit([&data](auto&& value) { data.Write(value); }, PropertyFlags);
    data.Write(ArrayDim);

    if (Type == PropertyType::StructProperty && prop.IsA<WFStructProperty>())
        data.Write(prop.Cast<WFStructProperty>().GetStruct().GetFullName());
    else if (Type == PropertyType::ObjectProperty && prop.IsA<WFObjectPropertyBase>())
        data.Write(prop.Cast<WFObjectPropertyBase>().GetPropertyClass().GetFullName());
    else if (Type == PropertyType::ArrayProperty && prop.IsA<WFArrayProperty>())
        GeneratedMember(prop.Cast<WFArrayProperty>().GetInner()).Serialize(data);
    else if (Type == PropertyType::ByteProperty && prop.IsA<WFByteProperty>())
        data.Write(prop.Cast<WFByteProperty>().GetEnum().GetFullName());
    else if (Type == PropertyType::BoolProperty && prop.IsA<WFBoolProperty>())
        data.Write(prop.Cast<WFBoolProperty>().GetFieldMask());
    else if (Type == PropertyType::EnumProperty && prop.IsA<WFEnumProperty>())
        data.Write(prop.Cast<WFEnumProperty>().GetEnum().GetFullName());
    else if (Type == PropertyType::ClassProperty && prop.IsA<WFClassProperty>())
        data.Write(prop.Cast<WFClassProperty>().GetMetaClass().GetFullName());
    else if (Type == PropertyType::SetProperty && prop.IsA<WFSetProperty>())
        GeneratedMember(prop.Cast<WFSetProperty>().GetElementProp()).Serialize(data);
    else if (Type == PropertyType::MapProperty && prop.IsA<WFMapProperty>()) {
        GeneratedMember(prop.Cast<WFMapProperty>().GetKeyProp()).Serialize(data);
        GeneratedMember(prop.Cast<WFMapProperty>().GetValueProp()).Serialize(data);
    }
    else if (Type == PropertyType::InterfaceProperty && prop.IsA<WFInterfaceProperty>())
        data.Write(prop.Cast<WFInterfaceProperty>().GetInterfaceClass().GetFullName());
    else if (Type == PropertyType::FieldPathProperty && prop.IsA<WFFieldPathProperty>())
        data.Write(std::visit([](auto&& name) -> auto { return name.GetName(); }, prop.Cast<WFFieldPathProperty>().GetPropertyName()));
    else if (Type == PropertyType::DelegateProperty && prop.IsA<WFDelegateProperty>())
        data.Write(prop.Cast<WFDelegateProperty>().GetFunction().GetFullName());
    else if (Type == PropertyType::MulticastDelegateProperty && prop.IsA<WFMulticastDelegateProperty>())
        data.Write(prop.Cast<WFMulticastDelegateProperty>().GetFunction().GetFullName());
    else if (Type == PropertyType::MulticastSparseDelegateProperty && prop.IsA<WFMulticastSparseDelegateProperty>())
        data.Write(prop.Cast<WFMulticastSparseDelegateProperty>().GetFunction().GetFullName());
    else if (Type == PropertyType::WeakObjectProperty && prop.IsA<WFWeakObjectProperty>())
        data.Write(prop.Cast<WFWeakObjectProperty>().GetPropertyClass().GetFullName());
    else if (Type == PropertyType::SoftClassProperty && prop.IsA<WFSoftClassProperty>())
        data.Write(prop.Cast<WFSoftClassProperty>().GetMetaClass().GetFullName());
    else if (Type == PropertyType::SoftObjectProperty && prop.IsA<WFSoftObjectProperty>())
        data.Write(prop.Cast<WFSoftObjectProperty>().GetPropertyClass().GetFullName());
}

GeneratedFunction::GeneratedFunction(WUFunction fn) {
    FullName = fn.GetFullName();
    CppName = fn.GetCppName();
    Flags = fn.GetFunctionFlags();
    Func = fn.GetFunc();
    Size = fn.GetSize();

    for (auto prop = fn.GetChildProperties().Cast<WFProperty>(); prop; prop = prop.GetNext().Cast<WFProperty>())
        Params.push_back(GeneratedMember(prop));
}

void GeneratedFunction::Serialize(Buffer& data) {
    data.Write(FullName);
    data.Write(CppName);
    std::visit([&data](auto&& value) { data.Write(value); }, Flags);
    data.Write(Size);

    data.Write(Params.size());
    for (auto& param : Params)
        param.Serialize(data);
}

GeneratedEnum::GeneratedEnum(WUEnum object) {
    FullName = object.GetFullName();
    CppName = object.GetCppName();

    std::visit([object, this](auto&& names) {
        std::string enumPrefix = object.GetName() + "::";

        for (int i = 0; i < names.Count; i++) {
            auto name = names.Data[i].Key.GetName();

            // Check if the name starts with prefix ENUMNAME:: and remove if necessary
            if (name.find(enumPrefix) == 0)
                name = name.erase(0, enumPrefix.length());

            Members.push_back({ name, names.Data[i].Value });
        }
    }, object.GetNames());
}

void GeneratedEnum::Serialize(Buffer& data) {
    data.Write(FullName);
    data.Write(CppName);

    data.Write(Members.size());
    for (auto const& member : Members) {
        data.Write(std::get<0>(member));
        data.Write(std::get<1>(member));
    }
}