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
