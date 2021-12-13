-- Transmitter functions for communication with the electron process

function fetchPlayerAddress()
    local addr = getAddressSafe("[[[[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.GameInstance]+GameInstance.LocalPlayers]+0]+LocalPlayer.PlayerController]+PlayerController.Pawn]")
    if addr == nil then
        return
    end
    local objName = FNameStringAlgo(addr + UObject.FNameIndex)
    
    -- Check that the object name starts with BP_Player_Conductor.
    -- When inside the engine (after pressing F key), this pointer gets replaced with a pointer to the engine.
    -- We need a pointer to the player object for things like changing switches
    if string.sub(objName, 1, 19) == "BP_Player_Conductor" then
        staticAddresses["LocalPlayerPawn"] = addr
    end
end

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
    staticAddresses["LocalPlayerPawn"] = 0

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
            elseif command == "P" then -- Ping
                pipe.writeString("P")
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
            fetchPlayerAddress()
        end
        print("destroy")
        if pipe then
            pipe.destroy()
        end
    end)

    pipeThread.Name = "Pipe Handler"
end