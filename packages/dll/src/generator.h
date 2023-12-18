#pragma once

#include <Vector>
#include <string>
#include "wrappers/uobject.h"
#include "wrappers/fproperty.h"
#include "net/buffer.h"

class GeneratedMember {
private:
    WFProperty prop;
public:
    GeneratedMember(WFProperty prop);

    PropertyType Type = PropertyType::Unknown;
    std::string Name;
    uint32_t Offset;
    uint32_t Size;
    int32_t ArrayDim;
    UEVariant(EPropertyFlags) PropertyFlags;

    void Serialize(Buffer& data);
};

class GeneratedFunction {
public:
    GeneratedFunction(WUFunction fn);

    std::string FullName;
    std::string CppName;
    std::vector<GeneratedMember> Params;
    UEVariant(EFunctionFlags) Flags;
    uint32_t Size = 0;
    void* Func = nullptr;

    void Serialize(Buffer& data);
};

class GeneratedStruct {
public:
    GeneratedStruct(WUStruct object);

    std::string FullName;
    std::string CppName;
    std::string SuperName;
    bool IsClass;
    uint32_t Inherited = 0;
    uint32_t Size = 0;
    std::vector<GeneratedMember> Members;
    std::vector<GeneratedFunction> Functions;

    void Serialize(Buffer& data);
};

class GeneratedEnum {
public:
    GeneratedEnum(WUEnum object);
    
    std::string FullName;
    std::string CppName;
    std::vector<std::tuple<std::string,int64_t>> Members;

    void Serialize(Buffer& data);
};
