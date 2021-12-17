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
