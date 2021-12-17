-- Initialize Cheat Engine correctly and call the transmitter and ue4 init

getAutoAttachList().add("arr-Win64-Shipping.exe")

GetLuaEngine().cbShowOnPrint.checked = false
GetLuaEngine().close()

logger = connectToPipe("RRO")

if logger == nil then
    print("Failed to connect to logger")
elseif printorig == nil then
    logger.writeString("CEL") -- Cheat Engine Logger
    printorig = print
    function print(data)
        printorig(data)
        if logger == nil then
            logger = connectToPipe("RRO")
            if logger ~= nil then
                logger.writeString("CEL")
                printorig("Logger reconnected")
            end
        end

        if logger ~= nil then
            result = logger.writeString(data)
            if result == nil then
                logger = nil
                printorig("Logger connection lost.")
            end
        end

    end
end

local bootstrapThread = createThread(function()
    local attached = false
    local i = 0
    while not attached do
        sleep(1000)
        attached = process and enumModules()[1]
        i = i+1
        if i > 5 then
            closeCE()
        end
    end
    print("(ATTACHED)")
    initue4()
    starttransmitter()
    while attached do
        sleep(5000)
        attached = process and enumModules()[1]
    end
    print("(DETACHED)")
    closeCE()
end)

bootstrapThread.Name = "Boostrap Thread"
-- UE4 Library functions (from UE4 CheatEngine Table by Cake-san)

function ue4config()
    local sub = targetIs64Bit() and 0 or 4
    UObject = {}
    if UE4ver <= 2 and targetIs64Bit() then
        ue4determineversion()
    end
    -----------------------------
    ----------UE4 struct---------
    if UE4ver > 2 then

        UObject.ObjectId = 0xC - sub
        UObject.Class = 0x10 - sub
        UObject.FNameIndex = 0x18 - (sub * 2)
        UObject.Outer = 0x20 - (sub * 2)

        UObject.enumMul = 0x10

        if UE4ver >= 25 then
            UObject.super = 0x40
            UObject.member = 0x50
            UObject.nextmember = 0x20
            UObject.Offset = 0x4C
            UObject.propsize = 0x3C
            UObject.bitmask = 0x7A
            UObject.funct = 0xD8
            UObject.Property = 0x78

        elseif UE4ver >= 22 then
            UObject.super = 0x40
            UObject.member = 0x48
            UObject.funct = 0xC0
        else
            UObject.super = 0x30 - (sub * 4)
            UObject.member = 0x38 - (sub * 5)
            UObject.funct = 0xB0
        end

        if UE4ver < 25 then
            UObject.nextmember = 0x28 - (sub * 3)
            UObject.Offset = 0x44 - (sub * 4)
            UObject.propsize = 0x34 - (sub * 3 / 2)
            UObject.bitmask = 0x72 - (sub * 8)

            UObject.Property = 0x70

        end

        if UE4ver < 11 then
            UObject.Offset = 0x4C
            UObject.enumMul = 0xC
        end

        ----------------------------
        ---------UE3 struct---------
        -- 1.25
    elseif UE4ver >= 1 then
        UObject.ObjectId = 0x4
        UObject.Outer = 0x14
        UObject.FNameIndex = 0x18
        UObject.Class = 0x20
        UObject.Offset = 0x48
        UObject.super = 0x34
        UObject.member = 0x38
        UObject.nextmember = 0x28
        UObject.propsize = 0x30
        UObject.bitmask = 0x60
        UObject.Property = 0x58
        UObject.enumMul = 0x8

        -- 0.10246
    else
        UObject.ObjectId = 0x20
        UObject.Outer = 0x28
        UObject.FNameIndex = 0x2C
        UObject.Class = 0x34

        UObject.Offset = 0x60

        UObject.super = 0x48
        UObject.member = 0x4C

        UObject.nextmember = 0x3C
        UObject.propsize = 0x44
        UObject.bitmask = 0x70
    end

    ---------------------------
end

local ue4type = {
    ['BoolProperty'] = vtByte,
    ['ByteProperty'] = vtByte,
    ['FloatProperty'] = vtSingle,
    ['StructProperty'] = vtDword,
    ['IntProperty'] = vtDword,
    ['NameProperty'] = vtQword,
    ['Int64Property'] = vtQword,
    ['TextProperty'] = vtPointer,
    ['StrProperty'] = vtPointer,
    ['ArrayProperty'] = vtPointer,
    ['MapProperty'] = vtPointer,
    ['ClassProperty'] = vtPointer,
    ['ObjectProperty'] = vtPointer
}

function ue4versioncheck()
    local fileversion, info = getFileVersion(enumModules()[1].PathToFile)
    if not info then
        UE4ver = 0
        return
    end
    -- return info.minor
    UE4ver = tonumber(info.minor .. '.' .. info.release)
end

function FNameStringAlgo(FName, IndexOnly)
    if not FName then
        return nil
    end
    local UEver = UE4ver
    local sub = targetIs64Bit() and 0 or 4
    local number, str, datatable
    if not IndexOnly then
        number = UEver > 2 and readInteger(FName + 4) or 0
        FName = readInteger(FName)
    else
        number = FName >> 32
        FName = FName & 0xFFFFFFFF
    end
    if not FName then
        return nil
    end
    if FNameList[FName] then
        if number > 0 then
            return FNameList[FName] .. '_' .. number - 1
        end
        return FNameList[FName]
    end
    local CFName = FName
    if UEver >= 23 then
        local i = (FName >> 0x10) + 1
        FName = (FName & 0xFFFF) * 2
        if i > #FNameDict or FName > #FNameDict[i] then
            return nil
        end
        datatable = {}
        for m = 1, 2 do
            datatable[m] = FNameDict[i][FName + m]
        end

        local le = byteTableToWord(datatable)
        if not le then
            return nil
        end
        le = le >> 6
        if le > 200 then
            return nil
        end
        local widechar = true and FNameDict[i][FName + 1] & 1 == 1 or false
        if widechar then
            datatable = {}
            for m = 1, le * 2 do
                datatable[m] = FNameDict[i][FName + 2 + m]
            end
            str = byteTableToWideString(datatable)
        else
            datatable = {}
            for m = 1, le do
                datatable[m] = FNameDict[i][FName + 2 + m]
            end
            str = byteTableToString(datatable)
        end
    else
        local i
        if UEver > 2 then
            i = (FName >> 0xE) + 1
            FName = (FName & 0x3FFF) * (8 - sub)
        else
            i = 1
            FName = FName * (8 - sub)
        end
        if i > #FNameDict or FName > #FNameDict[i] then
            return nil
        end
        local pointer
        if targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                datatable[m] = FNameDict[i][FName + m]
            end
            pointer = byteTableToQword(datatable)
        else
            datatable = {}
            for m = 1, 4 do
                datatable[m] = FNameDict[i][FName + m]
            end
            pointer = byteTableToDword(datatable)
        end
        if not pointer or pointer == 0 then
            return nil
        end

        -- local offset=UE4ver>=22 and 0xC-sub or 0x10-(sub*2)
        if FName == 1 and not stringoffset or not stringoffsetid then
            str = readString(pointer + 8, 13)
            if str == 'ByteProperty' then
                stringoffset = 8
            else
                str = readString(pointer + 0xC, 13)
                if str == 'ByteProperty' then
                    stringoffset = 0xC
                else
                    str = readString(pointer + 0x10, 13)
                    if str == 'ByteProperty' then
                        stringoffset = 0x10
                    end
                end
            end

            for j = 0, stringoffset - 4, 4 do
                if readInteger(pointer + j) == 2 then
                    stringoffsetid = j
                end
            end
            -- print(string.format('%X',FName))
            -- print(string.format('%X',pointer))
            -- print(string.format('%X',offset))

        else
            local widechar = true and readInteger(pointer + stringoffsetid) & 1 == 1 and UEver > 2 or false
            str = readString(pointer + stringoffset, 200, widechar)
            if not str then
                str = readString(pointer + stringoffset, 100, widechar)
            end
            if not str then
                str = readString(pointer + stringoffset, 50, widechar)
            end
            if not str then
                str = readString(pointer + stringoffset, 30, widechar)
            end
            if not str then
                local le = 0
                -- print(string.format('%X',FName))
                -- print(string.format('%X',pointer))
                while (true) do
                    if le > 50 then
                        break
                    end
                    if readBytes(pointer + stringoffset + le) == 0 then
                        break
                    end
                    le = le + 1
                end
                str = readString(pointer + stringoffset, le)
            end
            -- print(string.format('%X',pointer+0xC))
        end
    end
    if not str then
        return nil
    end
    if number > 0 then
        return str .. '_' .. number - 1
    end
    -- print(str)
    FNameList[CFName] = str
    return str
end

function GetNameAlgo(object)
    if not object then
        return nil
    end
    if ObjectList[object] then -- print(ObjectList[object])
        return ObjectList[object]
    end
    local fnameoffset = UObject.FNameIndex
    local typeoffset = UObject.Class
    local pointer = readPointer(object + typeoffset)
    if not pointer then
        return nil
    end
    -- print(string.format('%X',fnameoffset))
    -- print(string.format('%X',object+fnameoffset))
    local str1 = FNameStringAlgo(pointer + fnameoffset)
    local str2 = FNameStringAlgo(object + fnameoffset)
    if not str2 then
        str2 = FNameStringAlgo(object + fnameoffset - 8)
    end
    if not str1 or str1 == 'None' or not str2 or str2 == 'None' then
        return nil
    end
    str1 = str1 .. ' ' .. str2
    -- print(ObjectList[object])
    ObjectList[object] = str1
    return str1
end

function GetFullNameAlgo(object)
    if not object then
        return nil
    end
    -- if ObjectList[object] then return ObjectList[object] end
    local pathoffset = UObject.Outer
    local fnameoffset = UObject.FNameIndex
    local str = GetNameAlgo(object)
    if not str then
        return nil
    end
    local number = readInteger(object + fnameoffset + 4)
    local typ = str:sub(1, string.find(str, ' ') - 1)
    local isProperty = string.find(typ, 'Property')
    if not isProperty then
        isProperty = string.find(typ, 'Function')
    end
    local pointer = readPointer(object + pathoffset)
    while (true) do
        if not pointer or pointer == 0 then
            break
        end
        local stri = GetNameAlgo(pointer)
        if not stri then
            break
        end
        typ = stri:sub(1, string.find(stri, ' ') - 1)
        local isPropertyc = string.find(typ, 'Property')
        if not isPropertyc then
            isPropertyc = string.find(typ, 'Function')
        end
        stri = string.sub(str, 1, string.find(str, ' ')) .. stri:sub(string.find(stri, ' ') + 1, stri:len())
        local num = readInteger(pointer + fnameoffset + 4)

        if number ~= num and num == 0 or not isPropertyc and isProperty then
            stri = stri .. ':'
        else
            stri = stri .. '.'
        end
        number = num
        isProperty = isPropertyc

        str = stri .. string.sub(str, string.find(str, ' ') + 1, str:len())
        pointer = readPointer(pointer + pathoffset)

        if string.find(str, '%./') then
            stri = string.sub(str, 1, string.find(str, ' '))
            str = stri .. str:sub(string.find(str, '%./') + 1, str:len())
            break
        end

    end
    if not str then
        return nil
    end
    -- ObjectList[object]=str
    return str
end

function GetFullNameSuperAlgo(object)
    local super = UObject.super
    local str1 = GetFullNameAlgo(object)
    if not str1 then
        return nil
    end
    local pointer = readPointer(object + super)
    if pointer then
        local str2 = GetFullNameAlgo(pointer)
        if str2 then
            return str1 .. ' ~ ' .. str2
        end
    end
    return str1
end

function GetFullNameSafesAlgo(object)
    -- if ObjectList[object] then return ObjectList[object] end
    local fnameoffset = 0x28
    local typeoffset = 0x8
    local pathoffset = 0x10
    if not object then
        return nil
    end
    local pointer = readPointer(object + typeoffset)
    if not pointer then
        return nil
    end
    local str1 = FNameStringAlgo(pointer)
    local str2 = FNameStringAlgo(object + fnameoffset)
    local pointer = readPointer(object + pathoffset)
    if not pointer then
        return nil
    end
    local str3 = GetFullNameAlgo(pointer)
    if not str1 or str1 == 'None' or not str2 or str2 == 'None' or not str3 then
        return nil
    end
    -- print(str3)
    -- if string.find(str3,'%./') then string.sub
    local str = str1 .. string.sub(str3, string.find(str3, ' '), str3:len()) .. ':' .. str2
    -- ObjectList[object]=str
    return str
end

function GetFullNameSafeAlgo(object)
    -- if ObjectList[object] then return ObjectList[object] end
    local fnameoffset = 0x28
    local typeoffset = 0x8
    local pathoffset = 0x10
    if not object then
        return nil
    end
    local pointer = readPointer(object + typeoffset)
    if not pointer then
        return nil
    end
    local str1 = FNameStringAlgo(pointer)
    local str2 = FNameStringAlgo(object + fnameoffset)
    local pointer = readPointer(object + pathoffset)
    if not pointer then
        return nil
    end
    local str3 = GetFullNameAlgo(pointer)
    if not str3 then
        str3 = GetFullNameSafesAlgo(pointer)
    end

    if not str1 or str1 == 'None' or not str2 or str2 == 'None' or not str3 then
        return nil
    end
    -- print(str3)
    -- if string.find(str3,'%./') then string.sub
    local str = str1 .. string.sub(str3, string.find(str3, ' '), str3:len()) .. ':' .. str2
    -- ObjectList[object]=str
    return str
end

function FindString(namestr, start, stop)
    for i = start, stop do
        local name = FNameStringAlgo(i, true)
        if name and name:len() < 200 and name:len() > 2 and not string.find(name, '%c') then
            -- print(name)
            if name and name:len() < 200 and name:len() > 2 and not string.find(name, '%c') then
                if namestr == name then
                    FNameResult = i
                    return
                end
            end
        end
    end
end

function FindStringFName(namestr)
    local size
    if UE4ver >= 23 then
        size = (#FNameDict << 0x10) - 1
    elseif UE4ver > 2 then
        size = (#FNameDict << 0xE) - 1
    else
        size = math.floor(#FNameDict[1] / 4)
    end
    local count = 0x200
    size = math.floor((size / count) + 0.5)
    ue4parsetablecheck()
    FNameResult = nil
    local result
    local num, start, stop = count, 0, 0
    for i = 0, size do
        start = stop
        stop = stop + num
        if FNameResult then
            break
        end
        createThread(FindString(namestr, start, stop - 1))
    end
    result = FNameResult
    FNameResult = nil
    return result
end

function hasProperty(object)
    local str1
    if UE4ver >= 25 then
        str1 = GetFullNameSafeAlgo(object)
    else
        str1 = GetFullNameAlgo(object)
    end
    if not str1 then
        return nil
    end
    local pointer = readPointer(object + UObject.Property)
    if pointer then
        local str2 = GetFullNameAlgo(pointer)
        if not str2 then
            str2 = GetFullNameSafeAlgo(pointer)
        end
        if str2 then
            return str1 .. ' ~ ' .. str2
        end
    end
    return str1
end

function printInheritC(class)
    for i = 0, 10 do
        if not class or class == 0 then
            break
        end
        print(GetFullNameSuperAlgo(class))
        class = readPointer(class + UObject.super)
    end
end

function printInheritI(instance)
    instance = readPointer(instance + UObject.Class)
    printInheritC(instance)
end

function getregionsize(address)
    local allregion = enumMemoryRegions()
    for i = #allregion, 1, -1 do
        if allregion[i].BaseAddress <= address then
            local BaseAddress = allregion[i].BaseAddress
            local RegionSize = allregion[i].RegionSize
            local curSize = BaseAddress + RegionSize - address
            return curSize, RegionSize, BaseAddress
        end
    end
end
--[[
function parsefrombig(tab,index,size)
 local datatable={}
 if not tab then return nil end
 for i=1,size do
  datatable[i]=tab[index+i]
 end
 return datatable
end
]]

function ue4parsetable()
    FNameList = {}
    ObjectList = {}
    FullNameList = {}
    sub = targetIs64Bit() and 0 or 4
    local pool = getAddressSafe('FNamePool')
    local pool2 = getAddressSafe('GUObjectArray')
    if pool and pool2 then
        if UE4ver >= 20 then
            GUObjectsize = readInteger(getAddress('GUObjectArray+24') - (sub * 2))
        elseif UE4ver > 11 then
            GUObjectsize = readInteger('GUObjectArray+1C')
        else
            GUObjectsize = readInteger(getAddress('GUObjectArray+8') - (sub * 2))
        end
        FNameDict = {}
        GUObjectDict = {}
        for i = 0, 500 do
            local pointer
            if UE4ver >= 23 then
                pointer = readPointer(pool + i * (8 - sub) + 0x10)
            elseif UE4ver > 2 then
                pointer = readPointer(readPointer(pool) + i * (8 - sub))
            else
                pointer = readPointer(pool + i * (8 - sub))
            end
            if pointer and pointer ~= 0 then
                local size = getregionsize(pointer)
                if not size or size == 0 then
                    break
                end
                FNameDict[i + 1] = readBytes(pointer, size - 1, true)
            else
                break
            end
        end
        for i = 0, 500 do
            if UE4ver >= 20 then
                pointer = readPointer(readPointer(pool2 + 0x10) + i * (8 - sub))
                if pointer and pointer ~= 0 then
                    -- print(string.format('%X',pointer))
                    GUObjectDict[i + 1] = readBytes(pointer, getregionsize(pointer) - 1, true)
                else
                    break
                end
            elseif UE4ver > 11 then
                pointer = readPointer(pool2 + 0x10)
                if pointer and pointer ~= 0 then
                    GUObjectDict[i + 1] = readBytes(pointer, getregionsize(pointer) - 1, true)
                    break
                else
                    break
                end
            elseif UE4ver > 2 then
                pointer = readPointer(readPointer(pool2) + i * 8 + 0x10)
                if pointer and pointer ~= 0 then
                    GUObjectDict[i + 1] = readBytes(pointer, getregionsize(pointer) - 1, true)
                else
                    break
                end
            else
                pointer = readPointer(pool2)
                if pointer and pointer ~= 0 then
                    GUObjectDict[i + 1] = readBytes(pointer, getregionsize(pointer) - 1, true)
                    break
                else
                    break
                end
            end
        end
    end
end

function ue4parsetablecheck()
    if not FNameDict or not GUObjectDict then
        ue4parsetable()
    else
        local pointer, pointei, datatable, m
        if targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                datatable[m] = GUObjectDict[1][m]
            end
            pointer = byteTableToQword(datatable)
        else
            datatable = {}
            for m = 1, 4 do
                datatable[m] = GUObjectDict[1][m]
            end
            pointer = byteTableToDword(datatable)
        end
        if UE4ver >= 20 then
            pointei = readPointer('[[GUObjectArray+10]]')
        elseif UE4ver > 11 then
            pointei = readPointer('[GUObjectArray+10]')
        elseif UE4ver > 2 then
            pointei = readPointer('[[GUObjectArray]+10]')
        else
            pointei = readPointer('[GUObjectArray]')
        end
        -- print(string.format('%X',pointei))
        -- print(string.format('%X',pointer))
        if pointei ~= pointer then
            ue4parsetable()
        end
        local GUObjectsizes
        if UE4ver >= 20 then
            GUObjectsizes = readInteger(getAddress('GUObjectArray+24') - (sub * 2))
        elseif UE4ver > 11 then
            GUObjectsizes = readInteger('GUObjectArray+1C')
        else
            GUObjectsizes = readInteger(getAddress('GUObjectArray+8') - (sub * 2))
        end
        if GUObjectsizes ~= GUObjectsize then
            ue4parsetable()
        end
    end
end

function FindObject(threadlist, ObjectId, address, size, i, start, stop, fullname)
    local pointer, datatable
    for j = start, stop do

        if UE4ver < 11 and targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x8 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x8 + m]
            end
            pointer = byteTableToQword(datatable)
        elseif UE4ver < 11 then
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x4 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x4 + m]
            end
            pointer = byteTableToDword(datatable)
        elseif targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x18 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x18 + m]
            end
            pointer = byteTableToQword(datatable)
        else
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x10 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x10 + m]
            end
            pointer = byteTableToDword(datatable)
        end

        if pointer and pointer ~= 0 then
            local objid = readInteger(pointer + ObjectId)
            if objid and objid < size then
                local name = GetFullNameAlgo(pointer)
                if name and string.find(name, ' ') then
                    name = string.sub(name, string.find(name, ' ') + 1, name:len())
                    name = name:lower()
                    if not FullNameList[name] then
                        FullNameList[name] = pointer
                    end
                    if FullNameList[fullname] then
                        ObjectResult = FullNameList[fullname]
                        for k, v in ipairs(threadlist) do
                            v.terminate()
                        end
                        return
                    end
                end
            end
        end
    end
end

function StaticFindObjectAlgo(fullname)
    ue4parsetablecheck()
    fullname = fullname:lower()
    if FullNameList[fullname] then
        return FullNameList[fullname]
    end
    local threadlist = {}
    local k = 1
    local count = 0x200
    local size = GUObjectsize
    local sizess = targetIs64Bit() and (UE4ver > 11 and 0x18 * count or 0x8 * count) or
                       (UE4ver > 11 and 0x10 * count or 0x4 * count)
    local ObjectId = UObject.ObjectId
    ObjectResult = nil
    for i = 1, #GUObjectDict do
        local num, start, stop = count, 0, 0
        for j = 0, math.floor(#GUObjectDict[i] / sizess) do
            start = stop
            stop = stop + num
            if ObjectResult then
                break
            end
            threadlist[k] = createThread(FindObject(threadlist, ObjectId, GUObjectDict[i], size, i, start, stop - 1,
                fullname))
            k = k + 1
        end
    end
    local result = ObjectResult
    ObjectResult = nil
    return result
end

function registerFunc(ObjectId, address, size, i, start, stop)
    local funct = UObject.funct
    for j = start, stop do
        local pointer

        if UE4ver < 11 and targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x8 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x8 + m]
            end
            pointer = byteTableToQword(datatable)
        elseif UE4ver < 11 then
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x4 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x4 + m]
            end
            pointer = byteTableToDword(datatable)
        elseif targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x18 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x18 + m]
            end
            pointer = byteTableToQword(datatable)
        else
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x10 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x10 + m]
            end
            pointer = byteTableToDword(datatable)
        end

        if pointer and pointer ~= 0 then
            local objid = readInteger(pointer + ObjectId)
            if objid and objid < size then
                local name = GetFullNameAlgo(pointer)
                if name and string.find(name, ' ') then
                    local typ = string.sub(name, 1, string.find(name, ' ') - 1)
                    if typ == 'Function' then
                        local fullname = string.sub(name, string.find(name, ' ') + 1, name:len())
                        local func = readPointer(pointer + funct)
                        if func and func ~= 0 then
                            extralist.addSymbol('UE', fullname, func, 1)
                        end
                    end
                end
            end
        end
    end
end

function registerFuncAlgo()
    local funct = UObject.funct
    ue4parsetablecheck()
    if not extralist then
        extralist = createSymbolList()
        extralist.register()
    end
    if not enumUEObjIsRunning and UEObj then
        for i, v in ipairs(UEObj) do
            if v.Type == 'Function' then
                local func = readPointer(v.Address + funct)
                if func and func ~= 0 then
                    extralist.addSymbol('UE', v.FullName, func, 1)
                end
            end
        end
    else
        local k = 1
        local count = 0x200
        local size = GUObjectsize
        local sizess = UE4ver > 2 and (targetIs64Bit() and 0x18 * count or 0x10 * count) or 0x4 * count
        local ObjectId = UObject.ObjectId
        for i = 1, #GUObjectDict do
            local num, start, stop = count, 0, 0
            for j = 0, math.floor(#GUObjectDict[i] / sizess) do
                start = stop
                stop = stop + num
                if ObjectResult then
                    break
                end
                createThread(registerFunc(ObjectId, GUObjectDict[i], size, i, start, stop - 1))
                k = k + 1
            end
        end
    end
end

function isStructExist(name)
    for i = 1, #StructList do
        if StructList[i].Name == name then
            return StructList[i]
        end
    end
    return nil
end

function SaveAndRemoveStruct()
    StructList = {}
    local count = getStructureCount()
    for i = count - 1, 0, -1 do
        local struct = getStructure(i)
        StructList[i + 1] = struct
        struct:removeFromGlobalStructureList()
    end
end

function DeleteStruct(Struct)
    local count = #StructList
    for i = 1, count do
        if Struct == StructList[i] then
            Struct:Destroy()
            StructList[i] = nil
        end
        if not StructList[i] and StructList[i + 1] then
            StructList[i] = StructList[i + 1]
            StructList[i + 1] = nil
        end
    end
end

function LoadStruct()
    for i = 1, #StructList do
        StructList[i]:addToGlobalStructureList()
    end
end

function ChildStructStart(structname, elementname)
    local struct = isStructExist(structname)
    if struct then
        for i = 0, struct.Count - 1 do
            if struct.Element[i].Name == elementname then
                return struct.Element[i].ChildStructStart
            end
        end
    else
        return nil
    end
end

function findAddress(name, number, AddressOrAOBString, modulename, stopaddress, Nth, aobscanOnly, gethead, nop)
    local size, address = 0x100
    AddressOrAOBString, address = string.lower(AddressOrAOBString):gsub('banana', '')
    if (address > 0) then
        local f
        if (modulename == 0 or modulename == nil or modulename == '') then
            f = AOBScan(AddressOrAOBString)
        else
            if type(modulename) == type(0) then
                modulename = string.format('%X', modulename)
            elseif type(modulename) == type('') then
                modulename = [["]] .. modulename .. [["]]
            end
            local ms = createMemScan()
            if (stopaddress == 0 or stopaddress == nil or stopaddress == '') then
                stopaddress = getNameFromAddress(getAddress(modulename), true, false)
                if (stopaddress:find("+") ~= nil) then
                    stopaddress = stopaddress:sub(0, stopaddress:find("+") - 1)
                end
                if (getModuleSize(stopaddress) == nil) then
                    error('Module ' .. modulename .. ' not found')
                end
                modulename = getAddress([["]] .. stopaddress .. [["]])
                stopaddress = modulename + getModuleSize(stopaddress)
                modulename = string.format('%X', modulename)
            end
            ms.firstScan(soExactValue, vtByteArray, rtTruncated, AddressOrAOBString, '', getAddress(modulename),
                getAddress(stopaddress), '', fsmNotAligned, '', true, false, false, false)
            ms.waitTillDone()
            f = createFoundList(ms)
            f.initialize()
            ms.destroy()
        end
        address = {}
        for i = 0, f.Count - 1 do
            address[i + 1] = f[i]
        end
        f.destroy()
        if Nth == nil or Nth == 0 or Nth == '' then
            Nth = 1
        end
        if gethead then
            local addresss = GetAddressSafe(address[Nth])
            if not addresss then
                addresss = GetAddressSafe(address[Nth - 1])
            end
            if addresss and addresss ~= 0 then
                for i = 0, 0x1000 do
                    addresss = addresss - 1
                    if readBytes(addresss, 1) == 0xCC then
                        break
                    end
                    if nop then
                        local ext, opc, byt, add = splitDisassembledString(disassemble(addresss))
                        if string.find(opc, 'nop') then
                            addresss = addresss + getInstructionSize(addresss) - 1
                            break
                        end
                    end
                end
                address[Nth] = addresss + 1
            end
        end
        if number == nil or number == 0 or number == '' then
            if aobscanOnly then
                return address
            end
        else
            if (#address == 0) then
                error(name .. ' aob no result found')
            end
            if (getAddress(address[Nth]) == nil) then
                error(name .. ' aob result ' .. Nth .. ' doesnt exist')
            end
            unregisterSymbol(name)
            registerSymbol(name, getAddressSafe(address[Nth]), true)
            if aobscanOnly then
                return
            end
        end
        AddressOrAOBString = GetAddressSafe(address[Nth])
    end
    AddressOrAOBString = getAddressSafe(AddressOrAOBString)
    if (AddressOrAOBString == nil) then
        error(name .. ' still cant be found')
    end
    local addr = {}
    local i = 0
    local j = 1
    while (i < size) do
        local ext, opc, byt, add = splitDisassembledString(disassemble(getAddressSafe(AddressOrAOBString) + i))
        if (ext ~= "") then
            if (opc:find(",") ~= nil) then
                opc = opc:sub(opc:find(",") + 1, opc:len())
            else
                opc = opc:sub(opc:find(" ") + 1, opc:len())
            end
            addr[j] = opc:gsub("%[", ""):gsub("]", "")
            j = j + 1
        end
        if opc:find('],') then
            opc = opc:sub(opc:find("%[") + 1, opc:find("]") - 1)
            if tonumber(opc, 16) then
                addr[j] = opc
                j = j + 1
            end
        end
        i = i + getInstructionSize(AddressOrAOBString + i)
    end
    -- for i=1,#addr do print(addr[i]) end
    if number == nil or number == 0 or number == '' then
        return addr
    end
    local offset
    if (type(number) == type('')) then
        offset = string.find(number, ',')
        if (offset == nil) then
            number = getAddress(number)
        else
            offset = getAddress(string.sub(number, offset + 1, number:len()))
            number = getAddress(string.sub(number, 1, string.find(number, ',') - 1))
        end
    end
    if offset == nil then
        offset = 0
    end
    unregisterSymbol(name)
    registerSymbol(name, getAddressSafe(addr[number]) - offset, true)
end

function ue4determineversion()
    local address = findAddress('FNamePool', 0, '48 8D 0D *  *  *  *  E8 *  *  *  * 4C 8B C0 C6banana', process, nil, 0,
                        true)[1]
    if address then
        findAddress('FNamePool', 1, address)
        UE4ver = 25
        ue4parsetable()
        ue4config()
        local address = getAddressSafe(StaticFindObjectAlgo('/Script/Engine.GameEngine'))
        if not address or address == 0 then
            error('StaticFindObject not functioning as expected...')
        end
        UE4ver = nil
        local pointer = readPointer(address + UObject.member)
        if pointer then
            pointer = readPointer(pointer)
            if pointer then
                UE4ver = 25
            end
        end
        if not UE4ver then
            UE4ver = 23
        end
    else
        address = findAddress('FNamePool', 0,
                      '48 83 EC 28 48 8B 05 *  *  *  *  48 85 C0 75 *  B9 *  *  00 00 48 89 5C 24 20 E8banana', process,
                      nil, 0, true)[1]
        if address then
            findAddress('FNamePool', 1, address)
        else
            findAddress('FNamePool', 1, 'C3 *  DB 48 89 1D *  *  *  *  *  *  48 8B 5C 24 20banana', process, nil, 2)
        end
        local address = readPointer('[[GUObjectArray+10]]+18')
        if address > 0x10000 then
            UE4ver = 22
            ue4parsetable()
            ue4config()
            FNameStringAlgo(1, true)
            local address = getAddressSafe(StaticFindObjectAlgo('/Script/Engine.GameEngine'))
            if not address or address == 0 then
                error('StaticFindObject not functioning as expected...')
            end
            UE4ver = nil
            local pointer = readPointer(address + UObject.member)
            if pointer then
                pointer = readPointer(pointer)
                if pointer then
                    UE4ver = 22
                end
            end
            if not UE4ver then
                UE4ver = 20
            end
        else
            UE4ver = 18
        end
    end
end

function fillstruct4bytes(Struct)
    if not getElementByOffset(Struct, 0) then
        local e = Struct.addElement()
        e.Offset = 0
        e.Vartype = vtDword
    end
    Struct.beginUpdate()
    local count = Struct.Count - 1
    local list, k, element1, element2, size, bytesize = {}, 1
    for i = 0, count do
        element1 = Struct.Element[i]
        element2 = Struct.Element[i + 1]
        if element2 then
            bytesize = element1.Bytesize
            if bytesize < 4 then
                bytesize = 4
            end
            size = element2.Offset - element1.Offset - bytesize
            if size > 0 then
                if size % 4 > 0 then
                    size = 4 - size % 4 + size
                end
                local start = element1.Offset
                if start % 4 > 0 then
                    start = 4 - start % 4 + start
                else
                    start = start + 4
                end
                size = size / 4
                for j = 0, size - 1 do
                    if (start + j * 4) >= (element1.Offset + bytesize) then
                        list[k] = start + j * 4
                        k = k + 1
                    end
                end
            end
        end
    end
    for i, v in ipairs(list) do
        local e = Struct.addElement()
        e.Offset = v
        e.Vartype = vtDword
    end
    Struct.endUpdate()
end

function ue4createstruct(FullNameOrAddress, StructName, isGlobal, isfullname, Structu, AddedOffset, AddedName)
    if not FullNameOrAddress then
        return
    end
    if StructName and isGlobal then
        local Struct = isStructExist(StructName)
        if Struct then
            DeleteStruct(Struct)
        end
    end
    local member, Offset, Property, bitmask, nextmember, super, propsize = UObject.member, UObject.Offset,
        UObject.Property, UObject.bitmask, UObject.nextmember, UObject.super, UObject.propsize
    local Object, Name, Class, PropName, Typ, Off, pointer, e, f = FullNameOrAddress
    local isUE425 = UE4ver >= 25
    if type(FullNameOrAddress) == type('') then
        Object = StaticFindObjectAlgo(FullNameOrAddress)
    end
    if not Object then
        print(FullNameOrAddress .. ' not found...')
        return
    end
    Name = GetNameAlgo(Object)
    if not Name or not string.find(Name, ' ') then
        print(FullNameOrAddress .. ' invalid Object?')
        return
    end
    if not StructName then
        Class = Name:sub(1, string.find(Name, ' ') - 1)
        Name = Name:sub(string.find(Name, ' ') + 1, Name:len())
    else
        Name = StructName
    end

    local Struct = Structu
    if not Struct then
        Struct = createStructure(Name)
    end

    if not AddedName then
        AddedName = ''
    end
    local RunningStructName = name
    if not AddedOffset then
        if not RunningStruct then
            RunningStruct = {}
        end
        RunningStruct[#RunningStruct + 1] = RunningStructName

        AddedOffset = 0
        Struct.beginUpdate()
    else
        local FullName = GetFullNameAlgo(Object)
        FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())

        if not LocalStruct then
            LocalStruct = {}
        end
        if LocalStruct[FullName] then
            copyStruct(LocalStruct[FullName], Struct, AddedOffset, AddedName)
        else
            local copy = createStructure(FullName)
            ue4createstruct(Object, nil, nil, isfullname, copy)
            LocalStruct[FullName] = copy
            copyStruct(LocalStruct[FullName], Struct, AddedOffset, AddedName)
        end
        return
    end

    -- print(string.format('%X',Object))
    while (true) do
        if not Object or Object == 0 then
            break
        end
        Name = GetNameAlgo(Object)
        if not Name then
            break
        end
        Name = Name:sub(string.find(Name, ' ') + 1, Name:len())
        if Name == 'Object' then
            break
        end
        print(GetFullNameAlgo(Object))
        pointer = readPointer(Object + UObject.member)
        while (true) do
            if not pointer or pointer == 0 then
                break
            end
            PropName = isUE425 and GetFullNameSafeAlgo(pointer) or GetFullNameAlgo(pointer)
            if PropName and string.find(PropName, ' ') then
                Typ = PropName:sub(1, string.find(PropName, ' ') - 1)
                if not string.find(Typ, 'Function') then
                    if not isfullname then
                        PropName = PropName:sub(string.find(PropName, ':') + 1, PropName:len())
                    else
                        PropName = PropName:sub(string.find(PropName, ' ') + 1, PropName:len())
                    end
                    PropName = AddedName .. PropName
                    Off = readInteger(pointer + Offset) + AddedOffset
                    if Class == 'UserDefinedStruct' and string.find(PropName, '_') then
                        PropName = PropName:sub(1, string.find(PropName, '_') - 1)
                    end
                    if Typ == 'StructProperty' then
                        ue4createstruct(readPointer(pointer + Property), nil, nil, isfullname, Struct, Off,
                            PropName .. '.')
                        if not getElementByOffset(Struct, Off) then
                            e = Struct.addElement()
                            e.Offset = Off
                            e.Name = PropName
                            e.Vartype = vtDword
                        end
                    else
                        e = Struct.addElement()
                        e.Offset = Off
                        e.Name = PropName
                        if not ue4type[Typ] then
                            e.Vartype = vtDword
                        else
                            e.Vartype = ue4type[Typ]
                        end
                        if Typ == 'ArrayProperty' or Typ == 'MapProperty' then
                            f = Struct.addElement()
                            f.Offset = e.Offset + 8 - sub
                            f.Name = e.Name .. '_size'
                            f.Vartype = vtDword
                            f = Struct.addElement()
                            f.Offset = e.Offset + 0xC - sub
                            f.Name = e.Name .. '_sizes'
                            f.Vartype = vtDword
                            local isMap = Typ == 'MapProperty'

                            Prop = readPointer(pointer + Property)
                            PropName = GetFullNameAlgo(Prop)
                            if not PropName then
                                PropName = GetFullNameSafeAlgo(Prop)
                            end
                            if PropName then
                                Typ = PropName:sub(1, string.find(PropName, ' ') - 1)
                                PropName = PropName:sub(string.find(PropName, ':') + 1, PropName:len())
                                if string.find(PropName, ':') then
                                    PropName = PropName:sub(string.find(PropName, ':') + 1, PropName:len())
                                end
                                if Typ == 'StructProperty' then
                                    Prop = readPointer(Prop + Property)
                                    PropName = GetNameAlgo(Prop)
                                    if PropName then
                                        PropName = PropName:sub(string.find(PropName, ' ') + 1, PropName:len()) .. '[]'
                                        -- print(Typ..' '..PropName)
                                    end
                                else
                                    PropName = PropName .. '[]'
                                end
                                if not ArrayStruct then
                                    ArrayStruct = {}
                                end
                                if ArrayStruct[PropName] then
                                    e.setChildStruct(ArrayStruct[PropName])
                                else
                                    local stru = createStructure(PropName)
                                    ArrayStruct[PropName] = stru
                                    e.setChildStruct(stru)

                                    stru.beginUpdate()
                                    for j = 0, 1 do
                                        Prop = readPointer(pointer + Property + j * (8 - sub))
                                        PropName = GetFullNameAlgo(Prop)
                                        if not PropName then
                                            PropName = GetFullNameSafeAlgo(Prop)
                                        end
                                        if PropName then
                                            Typ = PropName:sub(1, string.find(PropName, ' ') - 1)
                                            -- if Typ=='StructProperty' then print(PropName)end
                                            PropName = PropName:sub(string.find(PropName, ':') + 1, PropName:len())
                                            if string.find(PropName, ':') then
                                                PropName = PropName:sub(string.find(PropName, ':') + 1, PropName:len())
                                            end
                                            local psize = isMap and 0x10 or readInteger(Prop + propsize)
                                            local Offs = isMap and readInteger(Prop + Offset) or 0
                                            local Propt
                                            if Typ == 'StructProperty' then
                                                Propt = readPointer(Prop + Property)
                                            end
                                            for p = 0, 10 do
                                                Off = p * psize + Offs
                                                local ItemName = string.format('[%u] ', p)
                                                if Typ == 'StructProperty' then
                                                    ue4createstruct(Propt, nil, nil, isfullname, stru, Off, ItemName)
                                                    -- if not getElementByOffset(stru,Off) then e=stru.addElement() e.Offset=Off e.Name=PropName e.Vartype=vtDword end
                                                else
                                                    local g = stru.addElement()
                                                    g.Offset = Off
                                                    g.Name = ItemName .. PropName
                                                    if not ue4type[Typ] then
                                                        g.Vartype = vtDword
                                                    else
                                                        g.Vartype = ue4type[Typ]
                                                    end
                                                end
                                            end
                                        end
                                    end
                                    stru.endUpdate()
                                    fillstruct4bytes(stru)
                                end
                            end
                        elseif Typ == 'BoolProperty' then
                            e.ChildStructStart = readBytes(pointer + bitmask, 1)
                        end
                    end
                end
            end
            pointer = readPointer(pointer + nextmember)
        end
        Object = readPointer(Object + super)
    end
    if AddedOffset > 0 then
        return
    end
    Struct.endUpdate()
    fillstruct4bytes(Struct)
    if isGlobal then
        StructList[#StructList + 1] = Struct
    end

    local count = #RunningStruct
    for i = 1, count do
        if RunningStruct[i] == RunningStructName then
            RunningStruct[i] = nil
        end
        if not RunningStruct[i] and RunningStruct[i + 1] then
            RunningStruct[i] = RunningStruct[i + 1]
            RunningStruct[i + 1] = nil
        end
    end
end

function getElementByOffset(struct, offset)
    for i = 0, struct.Count - 1 do
        if struct.Element[i].Offset == offset then
            return i
        end
    end
    return nil
end

function copyStruct(original, copy, AddedOffset, AddedName)
    if not copy then
        copy = createStructure(original.Name .. '_copy')
    end
    if not AddedOffset then
        AddedOffset = 0
    end
    if not AddedName then
        AddedName = ''
    end
    copy.beginUpdate()
    for i = 0, original.Count - 1 do
        local e = copy.addElement()
        e.Offset = original.Element[i].Offset + AddedOffset
        if original.Element[i].Name == '' then
            e.Name = original.Element[i].Name
        else
            e.Name = AddedName .. original.Element[i].Name
        end
        e.Vartype = original.Element[i].Vartype
        e.ChildStruct = original.Element[i].ChildStruct
        e.ChildStructStart = original.Element[i].ChildStructStart
        e.Bytesize = original.Element[i].Bytesize
    end
    copy.endUpdate()
    return copy
end

function ue4createstructfast(fullnameortable, StructName, isGlobal, isfullname, structu, AddedOffset, AddedName, depth,
    callernum)
    if not callernum then
        callernum = 0
    end
    if not depth then
        depth = 10
    end
    local depths = 0
    callernum = callernum + 1
    if callernum > 10 then
        return
    end
    if StructName and isGlobal then
        local struct = isStructExist(StructName)
        if struct then
            DeleteStruct(struct)
        end
    end
    if not UEObj then
        enumUEObj()
    end
    local tabl = fullnameortable
    if type(fullnameortable) == type('') then
        for i, v in ipairs(UEObj) do
            if v.FullName == fullnameortable then
                tabl = v
                break
            end
        end
    end
    --[[
  if not tabl or type(tabl)~=type({})  then
    enumUEObj()
    if type(fullnameortable)==type('') then
      for i,v in ipairs(UEObj) do if v.FullName==fullnameortable then tabl=v break end end
    end
  end
  ]]
    if not tabl or type(tabl) ~= type({}) then
        print(tostring(fullnameortable) .. ' not found...')
        return
    end
    local name = StructName
    if not name then
        name = tabl.Name
    end
    local struct = structu
    if not struct then
        struct = createStructure(name)
    end
    if not AddedName then
        AddedName = ''
    end
    local RunningStructName = name
    if not AddedOffset then
        if not RunningStruct then
            RunningStruct = {}
        end
        RunningStruct[#RunningStruct + 1] = RunningStructName

        AddedOffset = 0
        struct.beginUpdate()
    elseif tabl and tabl.FullName then
        if not LocalStruct then
            LocalStruct = {}
        end
        if LocalStruct[tabl.FullName] then
            copyStruct(LocalStruct[tabl.FullName], struct, AddedOffset, AddedName)
        else
            local copy = createStructure(tabl.FullName)
            ue4createstructfast(tabl, nil, nil, isfullname, copy)
            LocalStruct[tabl.FullName] = copy
            copyStruct(LocalStruct[tabl.FullName], struct, AddedOffset, AddedName)
        end
        return
    end

    -- print(tostring(tabl))
    local isUserDefinedStruct = string.find(tabl.Type, 'UserDefinedStruct')
    local e, typ, propname
    while (true) do
        if not tabl then
            break
        end
        if type(tabl) == type(1) or tabl.Name == 'Object' then
            break
        end
        print(tostring(tabl.Type) .. ' ' .. tostring(tabl.FullName))
        if tabl.Member then
            for i = 1, #tabl.Member do
                if tabl.Member[i].Type ~= 'Function' then
                    if isfullname then
                        e.Name = string.format('%s %s%s', tabl.Member[i].Type, AddedName, tabl.Member[i].FullName)
                    else
                        propname = AddedName .. tabl.Member[i].Name
                        if isUserDefinedStruct then
                            propname = propname:sub(1, string.find(propname, '_') - 1)
                        end
                    end
                    if tabl.Member[i].Type == 'StructProperty' then
                        ue4createstructfast(tabl.Member[i].Property, nil, nil, isfullname, struct,
                            tabl.Member[i].Offset + AddedOffset, propname .. '.', depth, callernum)
                        if not getElementByOffset(struct, tabl.Member[i].Offset + AddedOffset) then
                            e = struct.addElement()
                            e.Offset = tabl.Member[i].Offset + AddedOffset
                            e.Name = propname
                            e.Vartype = vtDword
                        end
                    else
                        e = struct.addElement()
                        e.Offset = tabl.Member[i].Offset + AddedOffset
                        typ = tabl.Member[i].Type
                        e.Name = propname
                        e.Vartype = ue4type[typ]
                        if e.Vartype == nil then
                            e.Vartype = vtDword
                        end
                        if typ == 'ArrayProperty' or typ == 'MapProperty' then
                            local isMap = Typ == 'MapProperty'
                            local Typ = tabl.Member[i].Property[1].Type
                            if Typ == 'StructProperty' then
                                propname = tabl.Member[i].Property[1].Property.Name .. '[]'
                            else
                                propname = tabl.Member[i].Property[1].Name .. '[]'
                            end
                            if not ArrayStruct then
                                ArrayStruct = {}
                            end
                            if ArrayStruct[propname] then
                                e.setChildStruct(ArrayStruct[propname])
                            else
                                local stru = createStructure(propname)
                                stru.beginUpdate()
                                for p = 1, #tabl.Member[i].Property do
                                    local PropName = tabl.Member[i].Property[p].Name
                                    local Typ = tabl.Member[i].Property[p].Type
                                    local psize = isMap and 0x10 or tabl.Member[i].Property[p].Size
                                    local Offs = isMap and tabl.Member[i].Property[p].Offset or 0
                                    for l = 0, 10 do
                                        Off = l * psize + Offs
                                        local ItemName = string.format('[%u] ', l)
                                        if Typ == 'StructProperty' then
                                            ue4createstructfast(tabl.Member[i].Property[p].Property, nil, nil,
                                                isfullname, stru, Off, ItemName, depth, callernum)
                                            -- if not getElementByOffset(stru,Off) then g=stru.addElement() g.Offset=Off g.Name=ItemName..PropName g.Vartype=vtDword end
                                        else
                                            g = stru.addElement()
                                            g.Offset = Off
                                            g.Name = ItemName .. PropName
                                            if not ue4type[Typ] then
                                                g.Vartype = vtDword
                                            else
                                                g.Vartype = ue4type[Typ]
                                            end
                                        end
                                    end
                                end
                                stru.endUpdate()
                                if stru.Count > 1 then
                                    fillstruct4bytes(stru)
                                    e.setChildStruct(stru)
                                    ArrayStruct[propname] = stru
                                else
                                    stru:Destroy()
                                end
                            end

                            local f = struct.addElement()
                            f.Offset = e.Offset + 8 - sub
                            f.Name = e.Name .. '_size'
                            f.Vartype = vtDword
                            f = struct.addElement()
                            f.Offset = e.Offset + 0xC - sub
                            f.Name = e.Name .. '_sizes'
                            f.Vartype = vtDword
                        elseif typ == 'BoolProperty' then
                            e.ChildStructStart = tabl.Member[i].BitField
                        end
                    end
                end
            end
        end
        depths = depths + 1
        if depths > depth then
            break
        end
        tabl = tabl.Parent
    end
    if AddedName ~= '' then
        return
    end
    struct.endUpdate()

    fillstruct4bytes(struct)
    if isGlobal then
        StructList[#StructList + 1] = struct
    end

    local count = #RunningStruct
    for i = 1, count do
        if RunningStruct[i] == RunningStructName then
            RunningStruct[i] = nil
        end
        if not RunningStruct[i] and RunningStruct[i + 1] then
            RunningStruct[i] = RunningStruct[i + 1]
            RunningStruct[i + 1] = nil
        end
    end
end

function uecreatestruct(instance, name, depth, isfullname)
    local pointer = readPointer(instance + UObject.Class)
    local classname = GetFullNameAlgo(pointer)
    if not classname then
        print('instance is invalid')
        return
    end
    if classname:find(' ') then
        classname = classname:sub(classname:find(' ') + 1)
    end

    print(string.format("createThread(ue4createstruct(\'%s\',\'%s\',0))", classname, name))
    ue4createstruct(pointer, name, depth, isfullname)
end

function ue_structureDissectOverrideCallback(Struct, Instance)
    -- print('banana2')
    local name, fullname, class
    address, name, fullname, class = ue_findRealStartOfObject(Instance)

    if class then
        -- print('banana3')
        -- if UEObj and (not enumUEObjIsRunning or enumUEObjIsUpdateOnly) then ue4createstructfast(fullname,nil,nil,nil,Struct) end
        SaveAndRemoveStruct()
        ue4createstruct(class, nil, nil, nil, Struct)
        LoadStruct()
        if Struct.Count > 1 then
            return true
        else
            return false
        end
    end

    -- ue_fillstruct(readPointer(Instance+UObject.Class),structure)
    -- print('banana4')

    return nil
end

function ue_structureNameLookupCallback(address)
    -- print('banana1')
    local name, fullname
    address, name, fullname = ue_findRealStartOfObject(address)
    if name then
        return name, address
    end
    return nil
end

function ue_SymbolLookupCallback(symbol)
    -- print('banana1')
    local str = 'Function '
    if string.find(symbol, str) then
        symbol = symbol:sub(string.find(symbol, str) + str:len(), symbol:len())
        local pointer = StaticFindObjectAlgo(symbol)
        if pointer then
            return readPointer(pointer + UObject.funct)
        end
    end
    return nil
end

function ue_findRealStartOfObject(address)
    local pointer = readPointer(address + UObject.Class)
    if pointer then
        local FullName = GetFullNameAlgo(pointer)
        if FullName then
            local Name = GetNameAlgo(pointer)
            FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())
            Name = Name:sub(string.find(Name, ' ') + 1, Name:len())
            return address, Name, FullName, pointer
        end
    end

    if UEObj and (not enumUEObjIsRunning or enumUEObjIsUpdateOnly) then
        for i = 1, #UEObj do
            if UEObj[i].MemberSize and UEObj[i].Class and UEObj[i].Class.MemberSize and UEObj[i].Class.MemberSize > 0 and
                not string.find(UEObj[i].Class.FullName, '/Script/CoreUObject.') then
                if address >= UEObj[i].Address and address < UEObj[i].Address + UEObj[i].Class.MemberSize then
                    local name
                    return UEObj[i].Address, UEObj[i].Class.Name, UEObj[i].Class.FullName, UEObj[i].Class.Address
                end
            end
        end
    end

    return address
end

function enumUEObjT(file, size, i, start, stop)
    local datatable, Address, FName, Name, FullName, typ, typ1, isProperty, l, pointer, stri, num, isPropertyc, EObj, k =
        0
    local Class, ObjectId, super, Offset, nextmember, member, propsize, bitmask, Property, Outer = UObject.Class,
        UObject.ObjectId, UObject.super, UObject.Offset, UObject.nextmember, UObject.member, UObject.propsize,
        UObject.bitmask, UObject.Property, UObject.Outer
    local UEver = UE4ver
    local pointersize = targetIs64Bit() and 8 or 4

    for j = start, stop do

        if UE4ver < 11 and targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x8 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x8 + m]
            end
            Address = byteTableToQword(datatable)
        elseif UE4ver < 11 then
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x4 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x4 + m]
            end
            Address = byteTableToDword(datatable)
        elseif targetIs64Bit() then
            datatable = {}
            for m = 1, 8 do
                if not GUObjectDict[i][j * 0x18 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x18 + m]
            end
            Address = byteTableToQword(datatable)
        else
            datatable = {}
            for m = 1, 4 do
                if not GUObjectDict[i][j * 0x10 + m] then
                    break
                end
                datatable[m] = GUObjectDict[i][j * 0x10 + m]
            end
            Address = byteTableToDword(datatable)
        end

        if Address and Address ~= 0 then
            objid = readInteger(Address + ObjectId)
            if objid then
                if objid < size then
                    FullName = GetFullNameAlgo(Address)

                    if FullName then
                        isProperty = false
                        typ1 = FullName:sub(1, string.find(FullName, ' ') - 1)
                        FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())
                        if string.find(FullName, '%:') then
                            Name = FullName:sub(string.find(FullName, '%:') + 1, FullName:len())
                            isProperty = true
                        elseif string.find(FullName, '%.') then
                            Name = FullName:sub(string.find(FullName, '%.') + 1, FullName:len())
                        else
                            Name = FullName
                        end
                        if UEObjIndex[FullName] and UEObj[UEObjIndex[FullName]] then
                            UEObj[UEObjIndex[FullName]].Address = Address
                        else
                            EObj = {}
                            EObj.Address = Address
                            EObj.Id = objid
                            EObj.Class = temp[readPointer(Address + Class)]
                            EObj.Type = typ1
                            EObj.FullName = FullName
                            EObj.Name = Name
                            if isProperty then
                                isProperty = readPointer(Address + Outer)
                                if isProperty and isProperty ~= 0 then
                                    EObj.Outer = isProperty
                                    EObj.Size = readInteger(Address + propsize)
                                    EObj.Offset = readInteger(Address + Offset)
                                    if typ1 == 'BoolProperty' then
                                        EObj.BitField = readBytes(Address + bitmask, 1)
                                    elseif typ1 == 'StructProperty' or typ1 == 'ObjectProperty' then
                                        EObj.Property = readPointer(Address + Property)
                                    elseif typ1 == 'MapProperty' or typ1 == 'ArrayProperty' then
                                        EObj.Property = {}
                                        local count = typ1 == 'MapProperty' and 1 or 0
                                        for p = 0, count do
                                            local prop = readPointer(Address + Property + p * 8)
                                            FullName = GetFullNameAlgo(prop)
                                            if not FullName then
                                                FullName = GetFullNameSafeAlgo(prop)
                                            end
                                            if FullName then
                                                typ = FullName:sub(1, string.find(FullName, ' ') - 1)
                                                FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())
                                                if string.find(FullName, '%:') then
                                                    Name = FullName:sub(string.find(FullName, '%:') + 1, FullName:len())
                                                else
                                                    Name = FullName
                                                end
                                                if string.find(Name, '%:') then
                                                    Name = Name:sub(string.find(Name, '%:') + 1, Name:len())
                                                end
                                                local Prop = {}
                                                Prop.Address = prop
                                                Prop.Type = typ
                                                Prop.FullName = FullName
                                                Prop.Name = Name
                                                Prop.Size = readInteger(prop + propsize)
                                                Prop.Offset = readInteger(prop + Offset)
                                                if typ == 'BoolProperty' then
                                                    Prop.BitField = readBytes(prop + bitmask, 1)
                                                elseif typ == 'StructProperty' or typ == 'ObjectProperty' then
                                                    Prop.Property = readPointer(prop + Property)
                                                end
                                                EObj.Property[p + 1] = Prop
                                            end
                                        end
                                    end
                                else
                                    print(FullName .. ' nil outer')
                                end
                            end

                            Parent = readPointer(Address + super)
                            if Parent and Parent ~= 0 then
                                EObj.Parent = Parent
                            end
                            temp[Address] = EObj
                            if UEver >= 25 then
                                k = 1
                                EObj.MemberSize = readInteger(Address + member + pointersize)
                                Address = readPointer(Address + member)
                                EObj.Member = {}

                                while (true) do
                                    if UEver >= 25 then
                                        FullName = GetFullNameSafeAlgo(Address)
                                    else
                                        FullName = GetFullNameAlgo(Address)
                                    end
                                    if not FullName then
                                        break
                                    end

                                    typ = FullName:sub(1, string.find(FullName, ' ') - 1)
                                    FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())
                                    if string.find(FullName, '%:') then
                                        Name = FullName:sub(string.find(FullName, '%:') + 1, FullName:len())
                                    else
                                        Name = FullName
                                    end
                                    EObj.Member[k] = {}
                                    EObj.Member[k].Address = Address
                                    EObj.Member[k].Type = typ
                                    EObj.Member[k].FullName = FullName
                                    EObj.Member[k].Name = Name
                                    EObj.Member[k].Size = readInteger(Address + propsize)
                                    EObj.Member[k].Offset = readInteger(Address + Offset)
                                    if typ == 'BoolProperty' then
                                        EObj.Member[k].BitField = readBytes(Address + bitmask, 1)
                                    elseif typ == 'StructProperty' or typ == 'ObjectProperty' then
                                        EObj.Member[k].Property = readPointer(Address + Property)
                                    elseif typ == 'MapProperty' or typ == 'ArrayProperty' then
                                        EObj.Member[k].Property = {}
                                        for p = 0, 1 do
                                            local prop = readPointer(Address + Property + p * 8)
                                            FullName = GetFullNameAlgo(prop)
                                            if not FullName then
                                                FullName = GetFullNameSafeAlgo(prop)
                                            end
                                            if FullName then
                                                typ = FullName:sub(1, string.find(FullName, ' ') - 1)
                                                FullName = FullName:sub(string.find(FullName, ' ') + 1, FullName:len())
                                                if string.find(FullName, '%:') then
                                                    Name = FullName:sub(string.find(FullName, '%:') + 1, FullName:len())
                                                else
                                                    Name = FullName
                                                end
                                                if string.find(Name, '%:') then
                                                    Name = Name:sub(string.find(Name, '%:') + 1, Name:len())
                                                end
                                                local Prop = {}
                                                Prop.Address = prop
                                                Prop.Type = typ
                                                Prop.FullName = FullName
                                                Prop.Name = Name
                                                Prop.Size = readInteger(prop + propsize)
                                                Prop.Offset = readInteger(prop + Offset)
                                                if typ == 'BoolProperty' then
                                                    Prop.BitField = readBytes(prop + bitmask, 1)
                                                elseif typ == 'StructProperty' or typ == 'ObjectProperty' then
                                                    local propt = readPointer(prop + Property)
                                                    if propt then
                                                        Prop.Property = propt
                                                    end
                                                end
                                                EObj.Member[k].Property[p + 1] = Prop
                                            end
                                        end
                                        if #EObj.Member[k].Property == 0 then
                                            EObj.Member[k].Property = nil
                                        end
                                    end
                                    Address = readPointer(Address + nextmember)
                                    k = k + 1
                                end
                                if #EObj.Member == 0 then
                                    EObj.Member = nil
                                end
                            end
                            UEObj[#UEObj + 1] = EObj
                            UEObjIndex[EObj.FullName] = #UEObj + 1
                        end
                    end
                end
            end
        end
    end
    -- print(i..':'..k)
end

function enumUEObj(isSilent, isUpdateOnly)
    if isUpdateOnly then
        enumUEObjIsUpdateOnly = true
    end
    enumUEObjIsRunning = true
    local sub = targetIs64Bit() and 0 or 4
    ue4parsetablecheck()
    local count = 0x200
    local size = GUObjectsize
    local sizess = targetIs64Bit() and (UE4ver > 11 and 0x18 * count or 0x8 * count) or
                       (UE4ver > 11 and 0x10 * count or 0x4 * count)
    local starttime = os.time()
    if not isUpdateOnly then
        UEObj = {}
        UEObjIndex = {}
    end
    temp = {}
    for i = 1, #GUObjectDict do
        local num, start, stop = count, 0, 0
        for j = 0, math.floor(#GUObjectDict[i] / sizess + 0.5) do
            start = stop
            stop = stop + num
            createThread(enumUEObjT(file, size, i, start, stop - 1))
        end
    end
    if not isUpdateOnly then
        if UE4ver >= 25 then
            for i = 1, #UEObj do
                if UEObj[i].Parent then
                    if temp[UEObj[i].Parent] then
                        UEObj[i].Parent = temp[UEObj[i].Parent]
                    end
                end
                if UEObj[i].Member then
                    for j = 1, #UEObj[i].Member do
                        if UEObj[i].Member[j].Property then
                            if temp[UEObj[i].Member[j].Property] then
                                UEObj[i].Member[j].Property = temp[UEObj[i].Member[j].Property]
                            elseif type(UEObj[i].Member[j].Property) == type({}) then
                                for p = 1, #UEObj[i].Member[j].Property do
                                    if temp[UEObj[i].Member[j].Property[p].Property] then
                                        UEObj[i].Member[j].Property[p].Property =
                                            temp[UEObj[i].Member[j].Property[p].Property]
                                    elseif UEObj[i].Member[j].Property[p].Property then
                                        print(string.format('%X no object?', UEObj[i].Member[j].Property[p].Property))
                                    elseif UEObj[i].Member[j].Property[p].Type == 'StructProperty' or
                                        UEObj[i].Member[j].Property[p].Type == 'ObjectProperty' then
                                        print(string.format('%s %s no property?', UEObj[i].Member[j].Property[p].Type,
                                            UEObj[i].Member[j].Property[p].FullName))
                                    end
                                end
                            end
                        end
                    end
                end
            end
        else
            for i = 1, #UEObj do
                if UEObj[i].Parent then
                    if temp[UEObj[i].Parent] then
                        UEObj[i].Parent = temp[UEObj[i].Parent]
                    end
                end
                if UEObj[i].Outer then
                    if temp[UEObj[i].Outer] then
                        if temp[UEObj[i].Property] then
                            UEObj[i].Property = temp[UEObj[i].Property]
                        elseif type(UEObj[i].Property) == type({}) then
                            for p = 1, #UEObj[i].Property do
                                if temp[UEObj[i].Property[p].Property] then
                                    UEObj[i].Property[p].Property = temp[UEObj[i].Property[p].Property]
                                else
                                    print(string.format('%X no object?', UEObj[i].Property[p].Property))
                                end
                            end
                        end
                        if not temp[UEObj[i].Outer].Member then
                            temp[UEObj[i].Outer].Member = {}
                        end
                        temp[UEObj[i].Outer].Member[#temp[UEObj[i].Outer].Member + 1] = UEObj[i]
                    else
                        print(UEObj[i].FullName .. ' missing outer')
                    end
                end
            end
        end
    end
    temp = nil
    enumUEObjIsUpdateOnly = false
    enumUEObjIsRunning = false
    if not isSilent then
        print(string.format('\nA Total of %u objects had been enumerated in %u seconds', #UEObj, os.time() - starttime))
    end
end

function findOpcodes(address, opcode, size)
    if not size then
        size = 0x50
    end
    address = getAddressSafe(address)
    if not address then
        return nil
    end
    local addr = {}
    local i = 0
    local j = 1
    while (i < size) do
        local ext, opc, byt, add = splitDisassembledString(disassemble(address + i))
        if string.find(opc, opcode) then
            addr[j] = address + i
            j = j + 1
        end
        i = i + getInstructionSize(address + i)
    end
    return addr
end

-- local ext, opc, byt, add=splitDisassembledString(disassemble(findOpcodes('/Script/Astro.PrinterComponent:UpdatePreprinting_exec','call')[1]))
-- return opc:sub(string.find(opc,' ')+1,opc:len())

function groupscan(value, modulename, stopaddress)
    local ms = createMemScan()
    if (modulename == 0 or modulename == nil or modulename == '') then
        modulename = 0
        stopaddress = 0x00007fffffffffff
    end
    ms.firstScan(soExactValue, vtGrouped, rtTruncated, value, '', modulename, stopaddress, '', fsmNotAligned, '', false,
        false, false, false)
    ms.waitTillDone()
    local f = createFoundList(ms)
    f.initialize()
    ms.destroy()
    local result = {}
    for i = 0, f.Count - 1 do
        result[i + 1] = f[i]
    end
    f.destroy()
    return result
end

function pointerscan(value, modulename, stopaddress)
    local ms = createMemScan()
    if (modulename == 0 or modulename == nil or modulename == '') then
        modulename = 0
        stopaddress = 0x00007fffffffffff
    end
    ms.firstScan(soExactValue, targetIs64Bit() and vtQword or vtDword, rtTruncated, value, '', modulename, stopaddress,
        '', fsmNotAligned, '', false, false, false, false)
    ms.waitTillDone()
    local f = createFoundList(ms)
    f.initialize()
    ms.destroy()
    local result = {}
    for i = 0, f.Count - 1 do
        result[i + 1] = f[i]
    end
    f.destroy()
    return result
end

function UEfindInstancesOfClass(fullnameOrAddress)
    local class, address = UObject.Class
    if type(fullnameOrAddress) == type('') then
        address = StaticFindObjectAlgo(fullnameOrAddress)
    else
        address = fullnameOrAddress
    end
    local fname = readInteger(address + UObject.FNameIndex)
    local result = groupscan(string.format('%u:%u 4:%u', targetIs64Bit() and 8 or 4, address, fname))
    for i, v in ipairs(result) do
        result[i] = tonumber(v, 16) - class
    end
    return result
end

function StructAddToListSymbol(StructName, StartOffset, StopOffset, BaseAddress, OffsetOnly)
    if not StartOffset then
        StartOffset = 0
    end
    if not StopOffset then
        StopOffset = 0xFFFFFF
    end
    local structCount = getStructureCount()
    local struct
    for i = 0, structCount - 1 do
        local stru = getStructure(i)
        if stru.Name == StructName then
            struct = stru
            break
        end
    end
    if struct then
        for i = 0, struct.Count - 1 do
            local e = struct.Element[i]
            if e.Offset >= StartOffset and e.Offset <= StopOffset then
                local rec = getAddressList().createMemoryRecord()
                rec.setDescription(e.Name)
                if OffsetOnly then
                    if BaseAddress then
                        rec.setAddress(BaseAddress)
                        rec.OffsetCount = 1
                        rec.Offset[0] = e.Offset
                    else
                        rec.setAddress(string.format('+%X', e.Offset))
                    end
                else
                    if BaseAddress then
                        rec.setAddress(BaseAddress)
                        rec.OffsetCount = 1
                        rec.OffsetText[0] = StructName .. '.' .. e.Name
                    else
                        rec.setAddress(string.format('+%s.%s', StructName, e.Name))
                    end
                end
                rec.Type = e.Vartype
            end
        end
    end
end

function getInsForJump(address, registername, destination, allocsize, SharedMemoryName)
    address = getAddressSafe(address)
    if not address then
        error('getInsForJump address nil')
        return
    end
    if not allocsize then
        allocsize = 4096
    end
    destination = getAddressSafe(destination)
    if not destination then
        if not SharedMemoryName then
            destination = allocateMemory(allocsize, address)
        else
            destination = allocateSharedMemory(SharedMemoryName, allocsize)
        end
    end
    local size = (address + 5 - destination > 0x7FFFFFFF) and 14 or 5
    if registername then
        unregisterSymbol(registername)
        registerSymbol(registername, destination, true)
    end
    local opcodes = {}
    local i = 0
    while (i < size) do
        local ext, opc = splitDisassembledString(disassemble(address + i))
        opcodes[#opcodes + 1] = opc
        i = i + getInstructionSize(address + i)
    end
    local copy = table.concat(opcodes, '\r\n')
    local readAsTable = true
    local byt = readBytes(address, i, readAsTable)
    for j = 1, #byt do
        byt[j] = ('%02X'):format(byt[j])
    end
    local bytes = table.concat(byt, ' ')
    return i, copy, bytes, size, destination
end

function enablescript(name, registername, addressname, script, disable)
    local address = getAddress(addressname)
    if disable then
        script = (script):format(address, registername, readBytes(registername, 1))
    else
        local i, copy, bytes, size = getInsForJump(address, name)
        script = (script):format(registername, registername, name, copy, registername, i, bytes, address) ..
                     string.rep('nop\n', i - size) .. 'returnhere:'
    end
    local success, erro = autoAssembleCheck(script)
    if not success then
        print('\n' .. erro .. '\n')
        local scriptstr = createStringlist()
        scriptstr.Text = script
        for j = 0, scriptstr.Count - 1 do
            print(string.format('%u\t%s', j + 1, scriptstr[j]))
        end
        if not disable then
            deAlloc(name)
            unregisterSymbol(name)
        end
        error(name .. ' autoAssemble failed')
    end
    autoAssemble(script)
    if disable then
        deAlloc(name)
        unregisterSymbol(name)
        unregisterSymbol(registername)
    end
end

-- Initialization of UE4 Lib functions and discovery of memory structures

function initue4()
    print("(PROGRESS 20%)")
    local starttime = os.time()
    ue4versioncheck()

    if targetIs64Bit() then

        local address = findAddress('GUObjectArray', 0, '44 8B * * * 48 8D 05 * * * * * * * * * 48 89 71 10banana',
                            process, nil, 0, true)[1]
        if not address then
            address = findAddress('GUObjectArray', 0, '40 53 48 83 EC 20 48 8B D9 48 85 D2 74 * 8Bbanana', process, nil,
                          0, true)[1]
        end
        if not address then
            address = findAddress('GUObjectArray', 0, '4C 8B 05 * * * * 45 3B 88banana', process, nil, 0, true)[1]
        end
        if not address then
            error('GUObjectArray aob not found...')
        end
        findAddress('GUObjectArray', 1, address)

        ue4config()

        if UE4ver >= 23 then
            address = findAddress('FNamePool', 0, '4C 8D 05 * * * * EB 16 48 8D 0D * * * * E8banana', process, nil, 0,
                          true)[1]
            if not address then
                address = findAddress('FNamePool', 0, '48 8D 0D *  *  *  *  E8 *  *  *  * 4C 8B C0 C6banana', process,
                              nil, 0, true)[1]
            end
            if address then
                findAddress('FNamePool', 1, address)
            else
                error('FNamePool aob not found...')
            end
        else
            address = findAddress('FNamePool', 0,
                          '48 83 EC 28 48 8B 05 *  *  *  *  48 85 C0 75 *  B9 *  *  00 00 48 89 5C 24 20 E8banana',
                          process, nil, 0, true)[2]
            if not address then
                address = findAddress('FNamePool', 0,
                              '48 83 EC 28 48 8B 05 *  *  *  *  48 85 C0 75 *  B9 *  *  00 00 48 89 5C 24 20 E8banana',
                              process, nil, 0, true)[1]
            end
            if address then
                findAddress('FNamePool', 1, address)
            else
                findAddress('FNamePool', 1, 'C3 *  DB 48 89 1D *  *  *  *  *  *  48 8B 5C 24 20banana', process, nil, 2)
            end
        end
        local address = findAddress('GEngine', 0, '41 B8 01 00 00 00 * * * 48 8B 0D * * * * E8 * * * * 48 85 C0banana',
                            process, nil, 0, true)[1]
        if not address then
            address = findAddress('GEngine', 0, '48 8B 1D * * * * 48 85 DB 74 * 48 8Dbanana', process, nil, 0, true)[1]
        end
        if not address then
            error('GEngine aob not found...')
        end
        findAddress('GEngine', 1, address)
        -- findAddress('GEngine',1,'41 B8 01 00 00 00 * * * 48 8B 0D * * * * E8 * * * * 48 85 C0banana',process)

    else
        ue4config()
        if UE4ver > 2 then
            findAddress('GEngine', 1, '56 8B 35 * * * * 85 F6 74banana', process)
            findAddress('GUObjectArray', 1, '8B 44 24 04 56 8B F1 85 C0 74 17 8B 40 08banana', process)
            findAddress('FNamePool', 1, '33 F6 89 35 * * * * 8B C6 5Ebanana', process, nil, 1, nil, true, true)
        else
            findAddress('GEngine', 1, '56 8B 35 * * * * 85 F6 74banana', process)
            findAddress('FNamePool', 1, '8B 07 8B 0D * * * * 8B 04 81banana', process)
            findAddress('GUObjectArray', 1, '8B 15 * * * * 8B 04 82 85banana', process)
        end
    end
    print('AOBScan done : ' .. os.time() - starttime)
    print("(PROGRESS 30%)")
    ue4parsetable()
    -- findAddress('GWorld',1,'4D 8B 94 24 50 0C 00 00banana',process)

    FNameStringAlgo(1, true)

    print('Table parsing done : ' .. os.time() - starttime)

    -- createThread(function()
    SaveAndRemoveStruct()

    local structCount = 0
    for name, options in pairs(ue4Structs) do structCount = structCount + 1 end
    
    local i = 0
    for name, options in pairs(ue4Structs) do
        i = i + 1
        print("(PROGRESS " ..string.format("%.3f", 40 + i / structCount * 50).. "%)")
        if options["global"] then
            createThread(ue4createstruct(options[1], name, 1))
        else
            createThread(ue4createstruct(options[1], name, 0))
        end
    end

    local RunningStructCounter = 0
    while (true) do
        if #RunningStruct == 0 then
            break
        else
            sleep(1)
        end
        RunningStructCounter = RunningStructCounter + 1
        if RunningStructCounter > 180000 then
            break
        end
    end
    LoadStruct()

    print("(PROGRESS 90%)")
    print('All done : ' .. os.time() - starttime .. '\n')
    if not ue_SymbolLookupCallbackID then
        ue_SymbolLookupCallbackID = registerSymbolLookupCallback(ue_SymbolLookupCallback, slNotSymbol)
    end
end
-- Definitions of memory structures that will be transmitted to the electron process

definitions = {
    Player = {{{"+PlayerState.PlayerNamePrivate", "+0"}, "s", 64},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
            {{"++PlayerState.PawnPrivate", "+GPlayer.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"}},
    PlayerMulti = {{{"+Character.myplayername", "+0"}, "s", 64},
            {{"+Character.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
            {{"+Character.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
            {{"+Character.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
            {{"+Character.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
            {{"+Character.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
            {{"+Character.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"}},
    FrameCar = {{{"+FrameCar.FrameType", "+0"}, "s", 64}, {{"+FrameCar.FrameName"}, "t", 64},
                {{"+FrameCar.FrameNumber", "+28", "+0"}, "s", 64},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
                {{"+FrameCar.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"},
                {{"+FrameCar.MyRegulator", "+Regulator.openPercentage"}, "f"},
                {{"+FrameCar.MyReverser", "+Reverser.forwardvalue"}, "f"},
                {{"+FrameCar.MyBrake", "+Brake.brakevalue"}, "f"},
                {{"+FrameCar.MyWhistle", "+Whistle.whistleopenfactor"}, "f"},
                {{"+FrameCar.Myhandvalvegenerator", "+Handvalve.openPercentage"}, "f"},
                {{"+FrameCar.Myhandvalvecompressor", "+Handvalve.openPercentage"}, "f"},
                {{"+FrameCar.MyBoiler", "+Boiler.currentboilerpressure"}, "f"},
                {{"+FrameCar.MyBoiler", "+Boiler.currentwatertemperature"}, "f"},
                {{"+FrameCar.MyBoiler", "+Boiler.currentwateramount"}, "f"},
                {{"+FrameCar.Mycompressor", "+Compressor.currentairpressure"}, "f"},
                {{"+FrameCar.MyBoiler", "+Boiler.currentfiretemperature"}, "f"},
                {{"+FrameCar.MyBoiler", "+Boiler.currentfuel"}, "f"},
                {{"+FrameCar.currentspeedms"}, "f"},
                {{"+FrameCar.maxspeedms"}, "i"},
                {{"+FrameCar.MyFreight", "+Freight.currentfreight"}, "i"},
                {{"+FrameCar.MyFreight", "+Freight.maxfreight"}, "i"},
                {{"+FrameCar.MyFreight", "+Freight.currentfreighttype", "+0"}, "s", 64}},
    Switch = {{{"+Switch.switchtype"}, "i"}, {{"+Switch.switchstate"}, "i"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
              {{"+Switch.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"}},
    Turntable = {{{"+TurnTable.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
                 {{"+TurnTable.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
                 {{"+TurnTable.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
                 {{"+TurnTable.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
                 {{"+TurnTable.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
                 {{"+TurnTable.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"},
                 {{"+TurnTable.deckmesh", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
                 {{"+TurnTable.deckmesh", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
                 {{"+TurnTable.deckmesh", "+SceneComponent.RelativeRotation.Roll"}, "f"}},
    WaterTower = {{{"+WaterTower.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
                  {{"+WaterTower.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
                  {{"+WaterTower.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
                  {{"+WaterTower.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
                  {{"+WaterTower.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
                  {{"+WaterTower.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"},
                  {{"+WaterTower.Mystorage", "+Storage.currentamountitems"}, "f"},
                  {{"+WaterTower.Mystorage", "+Storage.maxitems"}, "f"},
                  {{"+WaterTower.Mystorage", "+Storage.storagetype", "+0"}, "s", 256}},
    Industry = {{{"+Industry.industrytype"}, "i"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeLocation.X"}, "f"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeLocation.Y"}, "f"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeLocation.Z"}, "f"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeRotation.Pitch"}, "f"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeRotation.Yaw"}, "f"},
                {{"+Industry.RootComponent", "+SceneComponent.RelativeRotation.Roll"}, "f"},
                {{"+Industry.mystorageeducts1", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageeducts1", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageeducts1", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageeducts2", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageeducts2", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageeducts2", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageeducts3", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageeducts3", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageeducts3", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageeducts4", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageeducts4", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageeducts4", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageproducts1", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageproducts1", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageproducts1", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageproducts2", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageproducts2", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageproducts2", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageproducts3", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageproducts3", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageproducts3", "+Storage.storagetype", "+0"}, "s", 256},
                {{"+Industry.mystorageproducts4", "+Storage.currentamountitems"}, "f"},
                {{"+Industry.mystorageproducts4", "+Storage.maxitems"}, "f"},
                {{"+Industry.mystorageproducts4", "+Storage.storagetype", "+0"}, "s", 256}},
    Spline = {{{"+Spline.SplineControlPoints_size"}},
                {{"+Spline.SplineControlPoints"}},
                {{"+Spline.SplineMeshBoolArray"}},
                {{"+Spline.SplineType"}}},
}

-- If an channel actor STARTS WITH a particular name, it will use the corresponding definition
channelNames = {
    BP_Player_Conductor = "PlayerMulti",
    BP_SplineActor = "Spline",
    BP_switch = "Switch",
    BP_watertower = "WaterTower",
    BP_industry = "Industry",
    BP_turntable = "Turntable",

    flatcar = "FrameCar", --flatcar_cordwood, flatcar_hopper, flatcar_logs, flatcar_stakes, flatcar_tanker
    boxcar = "FrameCar",
    class70 = "FrameCar", --class70, class70_tender
    climax = "FrameCar",
    cooke260 = "FrameCar", --cooke260, cooke260_updg_tender
    eureka = "FrameCar", --eureka, eureka_tender
    handcar = "FrameCar",
    heisler = "FrameCar",
    porter = "FrameCar" --porter040, porter042
}

-- UE4 Structs to discover
ue4Structs = {
    -- UE4 objects
    GameEngine         = { "/Script/Engine.GameEngine", global = true },
    GameViewportClient = { "/Script/Engine.GameViewportClient" },
    GameInstance       = { "/Script/Engine.GameInstance" },
    LocalPlayer        = { "/Script/Engine.LocalPlayer", global = true },
    PlayerController   = { "/Script/Engine.PlayerController", global = true },
    MovementComponent  = { "/Script/Engine.CharacterMovementComponent" },
    CapsuleComponent   = { "/Script/Engine.CapsuleComponent", global = true },
    GPlayer            = { "/Script/Engine.Character" },
    World              = { "/Script/Engine.World" },

    -- RailroadsOnline Objects
    GameStateBase      = { "/Script/arr.arrGameStateBase" },
    GameModeBase       = { "/Script/arr.arrGameModeBase" },
    FrameCar           = { "/Script/arr.framecar" },
    BasedMovement      = { "/Script/Engine.BasedMovementInfo" },
    PlayerState        = { "/Script/Engine.PlayerState" },
    Character          = { "/Script/arr.SCharacter" },
    SceneComponent     = { "/Script/Engine.SceneComponent" },
    TurnTable          = { "/Script/arr.turntable" },
    Switch             = { "/Script/arr.Switch" },
    WaterTower         = { "/Script/arr.watertower" },
    Industry           = { "/Script/arr.industry" },
    Storage            = { "/Script/arr.storage" },
    Regulator          = { "/Script/arr.regulator" },
    Reverser           = { "/Script/arr.johnsonbar" },
    Brake              = { "/Script/arr.airbrake" },
    Whistle            = { "/Script/arr.whistle" },
    Spline             = { "/Script/arr.SplineActor" },
    Boiler             = { "/Script/arr.boiler" },
    Compressor         = { "/Script/arr.compressor" },
    Handvalve          = { "/Script/arr.handvalve" },
    Freight            = { "/Script/arr.freight" },
    NetDriver          = { "/Script/Engine.NetDriver" },
    NetConnection      = { "/Script/Engine.NetConnection" },
    ActorChannel       = { "/Script/Engine.ActorChannel" }
}
-- Function for reading addresses
-- Reading addresses can be done in 3 ways: read array index, read static address (in global staticAddresses table) or read from cheat engine address list
staticAddresses = {}

function retrieveAddress(pipe)
    local nameLength = pipe.readDword()
    local name = pipe.readString(nameLength)

    if name == "ARRAY" then
        local arrayNameLength = pipe.readDword()
        local arrayName = pipe.readString(arrayNameLength)
        local index = pipe.readDword()
        local offsetLength = pipe.readDword()
        local offset = pipe.readString(offsetLength)
        local clientMode = pipe.readDword()


        if clientMode == 1 then
            local addrArray = readPointer(getAddressSafe(
                "[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.NetDriver]+NetDriver.ServerConnection]+NetConnection.OpenChannels"))
            local arraySize = readInteger(getAddressSafe(
                "[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.NetDriver]+NetDriver.ServerConnection]+NetConnection.OpenChannels_size"))
            local actorOffset = getAddressSafe( "+ActorChannel.Actor" )

            if index >= arraySize or index < 0 then
                pipe.writeQword(0)
                return
            end
            
            local channelAddr = readPointer(addrArray + index * 8)
            local channelName = FNameStringAlgo(ChannelBase + UObject.FNameIndex)
    
            if string.sub(channelName, 1, 5) ~= "Actor" then -- Check that the channel is a valid Actor channel
                pipe.writeQword(0)
                return
            end

            BASE = readPointer(channelAddr + actorOffset)
            pipe.writeQword(getAddressSafe(offset))
        else
            local addrArray = readPointer(getAddressSafe(
            "[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.GameState]+GameStateBase." ..
                arrayName .. "Array"))
            local arraySize = readInteger(getAddressSafe(
                "[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.GameState]+GameStateBase." ..
                    arrayName .. "Array_size"))
            if index >= arraySize or index < 0 then
                pipe.writeQword(0)
                return
            end

            BASE = readPointer(addrArray + index * 8)
            pipe.writeQword(getAddressSafe(offset))
        end

        return
    end

    if staticAddresses[name] ~= nil then
        pipe.writeQword(staticAddresses[name])
        return
    end

    local record = getAddressList().getMemoryRecordByDescription(name)

    if record == nil then
        pipe.writeQword(0)
        return
    end

    pipe.writeQword(record.CurrentAddress)
end

-- Function for reading address value from cheat engine address list

function retrieveAddressValue(pipe)
    local nameLength = pipe.readDword()
    local name = pipe.readString(nameLength)

    local record = getAddressList().getMemoryRecordByDescription(name)

    if record == nil then
        pipe.writeDword(2)
        pipe.writeString("??")
    end

    local val = record.Value
    pipe.writeDword(#val)
    pipe.writeString(val)
end

-- Function for injecting DLL

function injectDLLFile(pipe)
    local pathLength = pipe.readDword()
    local path = pipe.readString(pathLength)
    print("(PROGRESS 95%)")
    print("Injecting DLL...")
    injectDLL(path)
    print("Injected DLL.")
    print("(PROGRESS 100%)")
    pipe.writeDword(1)
end
-- Functions for transmitting the world data

function prepareArrayProperties(id)
    local properties = definitions[id]
    local prepared = {}

    for p = 1, #properties do
        local address = properties[p][1]
        local path = {}
        for i = 1, #address do
            path[i] = getAddressSafe(address[i])
        end
        prepared[p] = {
            property = properties[p],
            path = path
        }
    end

    return prepared
end

function prepareArraysProperties()
    properties = {}

    for k, v in pairs(definitions) do
        properties[k] = prepareArrayProperties(k)
    end

    return properties
end

function transmitItem(pipe, baseAddr, properties, array, id)
    
    pipe.writeDword(id)

    -- We use a special approach for splines, as it requires subarrays
    if array == "Spline" then
        local offsSplinePointCount = properties[1].path[1]
        local offsSplinePoints = properties[2].path[1]
        local offsPointsVisible = properties[3].path[1]
        local offsSplineType = properties[4].path[1]

        local pointCount = readInteger(baseAddr + offsSplinePointCount)
        local addrPointsStart = readPointer(baseAddr + offsSplinePoints)
        local addrVisibleStart = readPointer(baseAddr + offsPointsVisible)

        local splineType = readInteger(baseAddr + offsSplineType)

        pipe.writeDword(splineType or 0)
        pipe.writeDword(pointCount or 0)

        for i = 0, pointCount - 1 do
            -- Read X
            pipe.writeFloat(readFloat(addrPointsStart + i * 12 + 0) or 0)
            -- Read Y
            pipe.writeFloat(readFloat(addrPointsStart + i * 12 + 4) or 0)
            -- Read Z
            pipe.writeFloat(readFloat(addrPointsStart + i * 12 + 8) or 0)
            -- Read Visible
            pipe.writeByte(readBytes(addrVisibleStart + i, 1) or 0)
        end

        return
    end

    for p = 1, #properties do
        property = properties[p].property
        path     = properties[p].path
        address  = baseAddr

        for j = 1, #path do
            if address == nil then
                break
            end
            
            address = address + path[j]
            if j ~= #path then
                address = readPointer(address)
            end
        end

        propType = property[2]
        if propType == "f" then
            pipe.writeFloat(readFloat(address) or 0)
        elseif propType == "i" then
            pipe.writeDword(readInteger(address) or 0)
        elseif propType == "s" then
            local str = readString(address, property[3], true)
            if str == nil then
                pipe.writeDword(0)
            else
                pipe.writeDword(#str)
                pipe.writeString(str)
            end
        elseif propType == "t" then -- Special text type to try to read a string in two differnt ways
            -- First try attempt 1 [[address+8]+0]
            local testAddr = readPointer(readPointer(address)+0x8)
            if testAddr ~= nil then
                testAddr = readPointer(testAddr)
            end

            if testAddr == nil then
                -- Try attempt 2 [address+28]
                testAddr = readPointer(readPointer(address)+0x28)
            end

            local str = nil
            if testAddr ~= nil then
                str = readString(testAddr, property[3], true)
            end

            if str == nil then
                pipe.writeDword(0)
            else
                pipe.writeDword(#str)
                pipe.writeString(str)
            end
        elseif propType == "b" then
            pipe.writeByte(readBytes(address, 1) or 0)
        end
    end
end

function transmitArray(array, pipe)
    pipe.writeDword(#array)
    pipe.writeString(array)

    properties = prepareArrayProperties(array)

    local addrArray = readPointer(getAddressSafe(
        "[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.GameState]+GameStateBase." .. array ..
            "Array"))
    local arraySize = readInteger(getAddressSafe(
        "[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.GameState]+GameStateBase." .. array ..
            "Array_size"))

    pipe.writeDword(arraySize)
    for i = 0, arraySize - 1 do
        transmitItem(pipe, readPointer(addrArray + i * 8), properties, array, i)
    end
end

function transmitChannels(pipe)
    local addrArray = readPointer(getAddressSafe(
        "[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.NetDriver]+NetDriver.ServerConnection]+NetConnection.OpenChannels"))
    local arraySize = readInteger(getAddressSafe(
        "[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.NetDriver]+NetDriver.ServerConnection]+NetConnection.OpenChannels_size"))

    if addrArray == nil or arraySize == nil then
        pipe.writeDword(0)
        return
    end

    local arrayProperties = prepareArraysProperties()

    local actorOffset = getAddressSafe( "+ActorChannel.Actor" )

    for i = 0, arraySize - 1 do
        ChannelBase = readPointer(addrArray + i * 8)
        ChannelName = FNameStringAlgo(ChannelBase + UObject.FNameIndex)

        if string.sub(ChannelName, 1, 5) == "Actor" then -- Check that the channel name is ActorChannel_XXXXX by checking it starts with actor
            ActorBase = readPointer(ChannelBase + actorOffset)
            ActorName = FNameStringAlgo(ActorBase + UObject.FNameIndex)
            for k, v in pairs(channelNames) do
                if ActorName ~= nil and string.sub(ActorName, 1, #k) == k then
                    pipe.writeDword(#v)
                    pipe.writeString(v)
                    transmitItem(pipe, ActorBase, arrayProperties[v], v, i)
                    break
                end
            end
        end
    end

end

-- Function for retrieving player index

local cachedPlayerAddress = 0

function getPlayerAddress()
    return getAddressSafe("[[[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.GameInstance]+GameInstance.LocalPlayers]+0]+LocalPlayer.PlayerController]+PlayerController.Pawn]")
end

function cachePlayerAddress()
    local addr = getPlayerAddress()
    if addr == nil then
        return
    end
    local objName = FNameStringAlgo(addr + UObject.FNameIndex)
    
    -- Check that the object name starts with BP_Player_Conductor.
    -- When inside the engine (after pressing F key), this pointer gets replaced with a pointer to the engine.
    -- We need a pointer to the player object for things like changing switches
    if string.sub(objName, 1, 19) == "BP_Player_Conductor" then
        cachedPlayerAddress = addr
    end
end

function getPlayer(pipe)
    local addr = getPlayerAddress()
    if addr == nil then
        pipe.writeQword(cachedPlayerAddress)
        pipe.writeDword(1)
        return
    end

    local objName = FNameStringAlgo(addr + UObject.FNameIndex)
    
    if string.sub(objName, 1, 19) == "BP_Player_Conductor" then
        pipe.writeQword(addr)
        pipe.writeDword(0)
        return
    end

    pipe.writeQword(cachedPlayerAddress)
    pipe.writeDword(1)
end
-- Transmitter functions for communication with the electron process

pipe = nil

function connectPipe()
    pipe = connectToPipe("RRO")

    if pipe == nil then
        print("Unable to connect to pipe")
        return
    end

    pipe.writeString("CED") -- CheatEngine Data
end

function starttransmitter()
    staticAddresses["KismetSystemLibrary"] = StaticFindObjectAlgo('/Script/Engine.Default__KismetSystemLibrary')
    staticAddresses["GameplayStatics"] = StaticFindObjectAlgo('/Script/Engine.Default__GameplayStatics')

    pipeThread = createThread(function(thread)
        connectPipe()

        if pipe == nil then
            closeCE()
            return
        end

        while not thread.Terminated do
            command = pipe.readString(1)
            if command == "R" then -- Read tables
                local readMode = pipe.readDword()
                if readMode == 2 then -- CLIENT read mode
                    transmitChannels(pipe)
                else -- HOST read mode
                    transmitArray("Player", pipe)
                    transmitArray("FrameCar", pipe)
                    transmitArray("Turntable", pipe)
                    transmitArray("Switch", pipe)
                    transmitArray("WaterTower", pipe)
                    transmitArray("Industry", pipe)
                    if readMode == 0 then -- Host FULL read mode
                        transmitArray("Spline", pipe)
                    end
                end
                pipe.writeDword(0)
            elseif command == "P" then -- Player
                getPlayer(pipe)
            elseif command == "S" then -- Stop
                closeCE()
            elseif command == "A" then -- Get Address
                retrieveAddress(pipe)
            elseif command == "V" then -- Get Address Value
                retrieveAddressValue(pipe)
            elseif command == "I" then -- Inject DLL
                injectDLLFile(pipe)
            elseif command == nil and not thread.Terminated then
                print("Pipe disconnected. Attempting to reconnect...")
                pipe = nil
                while pipe == nil and not thread.Terminated do
                    sleep(2000)
                    connectPipe()
                end
            end
            cachePlayerAddress()
        end
        print("destroy")
        if pipe then
            pipe.destroy()
        end
    end)

    pipeThread.Name = "Pipe Handler"
end