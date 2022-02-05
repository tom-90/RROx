-- Function for reading address value from cheat engine address list

function getObjectName(pipe)
    local addr = pipe.readQword()
    local name = FNameStringAlgo(addr + UObject.FNameIndex)
    
    if name == nil then
        pipe.writeDword(0)
    else
        pipe.writeDword(#name)
        pipe.writeString(name)
    end
end
