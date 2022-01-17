function getVegetationSpawners(pipe)
    local addrArray = readPointer(getAddressSafe("[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.AuthorityGameMode]+GameModeBase.VegetationSpawnerArray"))
    local arraySize = readInteger(getAddressSafe("[[[[GEngine]+GameEngine.GameViewport]+GameViewportClient.World]+World.AuthorityGameMode]+GameModeBase.VegetationSpawnerArray_size"))

    if addrArray == nil or arraySize == nil then
        pipe.writeDword(0)
        return
    end

    pipe.writeDword(arraySize)
    for i = 0, arraySize - 1 do
        addrVegetationSpawner = readPointer(addrArray + i * 8)
        pipe.writeQword(addrVegetationSpawner)
    end
end