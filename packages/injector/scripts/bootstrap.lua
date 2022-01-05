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