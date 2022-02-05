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
                    transmitArray("Sandhouse", pipe)
                    transmitArray("Industry", pipe)
                    if readMode == 0 then -- Host FULL read mode
                        transmitArray("Spline", pipe)
                    end
                end
                pipe.writeDword(0)
            elseif command == "P" then -- Player
                getPlayer(pipe)
            elseif command == "S" then -- Show Window
                unhideMainCEwindow()
                GetAddressList().Parent = GetMainForm()
            elseif command == "A" then -- Get Address
                retrieveAddress(pipe)
            elseif command == "V" then -- Get Address Value
                retrieveAddressValue(pipe)
            elseif command == "T" then -- Get Tree Vegetation Spawner addresses
                getVegetationSpawners(pipe)
            elseif command == "I" then -- Inject DLL
                injectDLLFile(pipe)
            elseif command == "N" then -- Name of Object
                getObjectName(pipe)
            elseif command == "W" then -- Write Address Value
                setAddressValue(pipe)
            elseif command == nil and not thread.Terminated then
                print("Pipe disconnected. Attempting to reconnect...")
                pipe = nil
                connectPipe()
                print("Reconnect failed. Waiting 2 seconds...")
                if pipe == nil then
                    sleep(2000)
                    print("Attempting to reconnect...")
                    connectPipe()
                    if pipe == nil then
                        print("Pipe connection lost. Closing...")
                        closeCE()
                    end
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