-- Function for reading address value from cheat engine address list

function retrieveAddressValue(pipe)
    local nameLength = pipe.readDword()
    local name = pipe.readString(nameLength)

    if name == "InGameTest" then
        local authorityGameMode = getAddressSafe("[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.AuthorityGameMode]")
        if authorityGameMode == nil then
            pipe.writeDword(2)
            pipe.writeString("??")
            return
        end

        local gameModeName = FNameStringAlgo(authorityGameMode + UObject.FNameIndex)

        pipe.writeDword(#gameModeName)
        pipe.writeString(gameModeName)
        return
    end

    local record = getAddressList().getMemoryRecordByDescription(name)

    if record == nil then
        pipe.writeDword(2)
        pipe.writeString("??")
        return
    end

    local val = record.Value
    pipe.writeDword(#val)
    pipe.writeString(val)
end
