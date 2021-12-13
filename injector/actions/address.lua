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
