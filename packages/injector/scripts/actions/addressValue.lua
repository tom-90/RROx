-- Function for reading address value from cheat engine address list

function retrieveAddressFromList(pipe, name)
    if name == "InGameTest" then
        local authorityGameMode = getAddressSafe("[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.AuthorityGameMode]")
        
        if authorityGameMode == 0 then
            pipe.writeDword(#"Client")
            pipe.writeString("Client")
            return
        end
        
        if authorityGameMode == nil then
            pipe.writeDword(2)
            pipe.writeString("??")
            return
        end

        local gameModeName = FNameStringAlgo(authorityGameMode + UObject.FNameIndex)

        if gameModeName == nil then
            pipe.writeDword(2)
            pipe.writeString("??")
            return
        end

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

function retrieveAddressValue(pipe)

    local mode = pipe.readDword()

    if mode == 1 then -- Read raw address
        local valueType = pipe.readDword()
        local address = pipe.readQword()
        
        if valueType == 1 then -- Read single byte
            pipe.writeByte(readBytes(address, 1) or 0)
        elseif valueType == 2 then -- Read Float
            pipe.writeFloat(readFloat(address) or 0)
        end

    elseif mode == 2 then -- Read address from address list
        local nameLength = pipe.readDword()
        local name = pipe.readString(nameLength)
        retrieveAddressFromList(pipe,name)
    end
end
