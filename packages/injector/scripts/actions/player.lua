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