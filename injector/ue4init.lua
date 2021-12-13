-- Initialization of UE4 Lib functions and discovery of memory structures

function initue4()
    print("(PROGRESS 20%)")
    local starttime = os.time()
    ue4versioncheck()

    if targetIs64Bit() then

        local address = findAddress('GUObjectArray', 0, '44 8B * * * 48 8D 05 * * * * * * * * * 48 89 71 10banana',
                            process, nil, 0, true)[1]
        if not address then
            address = findAddress('GUObjectArray', 0, '40 53 48 83 EC 20 48 8B D9 48 85 D2 74 * 8Bbanana', process, nil,
                          0, true)[1]
        end
        if not address then
            address = findAddress('GUObjectArray', 0, '4C 8B 05 * * * * 45 3B 88banana', process, nil, 0, true)[1]
        end
        if not address then
            error('GUObjectArray aob not found...')
        end
        findAddress('GUObjectArray', 1, address)

        ue4config()

        if UE4ver >= 23 then
            address = findAddress('FNamePool', 0, '4C 8D 05 * * * * EB 16 48 8D 0D * * * * E8banana', process, nil, 0,
                          true)[1]
            if not address then
                address = findAddress('FNamePool', 0, '48 8D 0D *  *  *  *  E8 *  *  *  * 4C 8B C0 C6banana', process,
                              nil, 0, true)[1]
            end
            if address then
                findAddress('FNamePool', 1, address)
            else
                error('FNamePool aob not found...')
            end
        else
            address = findAddress('FNamePool', 0,
                          '48 83 EC 28 48 8B 05 *  *  *  *  48 85 C0 75 *  B9 *  *  00 00 48 89 5C 24 20 E8banana',
                          process, nil, 0, true)[2]
            if not address then
                address = findAddress('FNamePool', 0,
                              '48 83 EC 28 48 8B 05 *  *  *  *  48 85 C0 75 *  B9 *  *  00 00 48 89 5C 24 20 E8banana',
                              process, nil, 0, true)[1]
            end
            if address then
                findAddress('FNamePool', 1, address)
            else
                findAddress('FNamePool', 1, 'C3 *  DB 48 89 1D *  *  *  *  *  *  48 8B 5C 24 20banana', process, nil, 2)
            end
        end
        local address = findAddress('GEngine', 0, '41 B8 01 00 00 00 * * * 48 8B 0D * * * * E8 * * * * 48 85 C0banana',
                            process, nil, 0, true)[1]
        if not address then
            address = findAddress('GEngine', 0, '48 8B 1D * * * * 48 85 DB 74 * 48 8Dbanana', process, nil, 0, true)[1]
        end
        if not address then
            error('GEngine aob not found...')
        end
        findAddress('GEngine', 1, address)
        -- findAddress('GEngine',1,'41 B8 01 00 00 00 * * * 48 8B 0D * * * * E8 * * * * 48 85 C0banana',process)

    else
        ue4config()
        if UE4ver > 2 then
            findAddress('GEngine', 1, '56 8B 35 * * * * 85 F6 74banana', process)
            findAddress('GUObjectArray', 1, '8B 44 24 04 56 8B F1 85 C0 74 17 8B 40 08banana', process)
            findAddress('FNamePool', 1, '33 F6 89 35 * * * * 8B C6 5Ebanana', process, nil, 1, nil, true, true)
        else
            findAddress('GEngine', 1, '56 8B 35 * * * * 85 F6 74banana', process)
            findAddress('FNamePool', 1, '8B 07 8B 0D * * * * 8B 04 81banana', process)
            findAddress('GUObjectArray', 1, '8B 15 * * * * 8B 04 82 85banana', process)
        end
    end
    print('AOBScan done : ' .. os.time() - starttime)
    print("(PROGRESS 30%)")
    ue4parsetable()
    -- findAddress('GWorld',1,'4D 8B 94 24 50 0C 00 00banana',process)

    FNameStringAlgo(1, true)

    print('Table parsing done : ' .. os.time() - starttime)

    -- createThread(function()
    SaveAndRemoveStruct()

    print("(PROGRESS 40%)")
    createThread(ue4createstruct('/Script/Engine.GameEngine', 'GameEngine', 1))
    createThread(ue4createstruct('/Script/Engine.GameViewportClient', 'GameViewportClient', 0))
    createThread(ue4createstruct('/Script/Engine.GameInstance', 'GameInstance', 0))
    print("(PROGRESS 45%)")
    createThread(ue4createstruct('/Script/Engine.LocalPlayer', 'LocalPlayer', 1))
    createThread(ue4createstruct('/Script/Engine.PlayerController', 'PlayerController', 2))
    createThread(ue4createstruct('/Script/Engine.CharacterMovementComponent', 'MovementComponent', 0))
    print("(PROGRESS 50%)")
    createThread(ue4createstruct('/Script/Engine.CapsuleComponent', 'CapsuleComponent', 3))
    createThread(ue4createstruct('/Script/Engine.Character', 'GPlayer', 0))
    createThread(ue4createstruct('/Script/Engine.World', 'World', 0))
    print("(PROGRESS 55%)")

    -- Additions ARR
    print("(PROGRESS 60%)")
    createThread(ue4createstruct('/Script/arr.arrGameStateBase', 'GameStateBase', 0))
    createThread(ue4createstruct('/Script/arr.arrGameModeBase', 'GameModeBase', 0))
    createThread(ue4createstruct('/Script/arr.framecar', 'FrameCar', 0))
    createThread(ue4createstruct('/Script/Engine.BasedMovementInfo', 'BasedMovement', 0))
    print("(PROGRESS 65%)")
    createThread(ue4createstruct('/Script/Engine.PlayerState', 'PlayerState', 0))
    createThread(ue4createstruct('/Script/arr.SCharacter', 'Character', 0))
    createThread(ue4createstruct('/Script/Engine.SceneComponent', 'SceneComponent', 0))
    createThread(ue4createstruct('/Script/arr.turntable', 'TurnTable', 0))
    print("(PROGRESS 70%)")
    createThread(ue4createstruct('/Script/arr.Switch', 'Switch', 0))
    createThread(ue4createstruct('/Script/arr.watertower', 'WaterTower', 0))
    createThread(ue4createstruct('/Script/arr.industry', 'Industry', 0))
    print("(PROGRESS 75%)")
    createThread(ue4createstruct('/Script/arr.regulator', 'Regulator', 0))
    createThread(ue4createstruct('/Script/arr.johnsonbar', 'Reverser', 0))
    createThread(ue4createstruct('/Script/arr.airbrake', 'Brake', 0))
    print("(PROGRESS 80%)")
    createThread(ue4createstruct('/Script/arr.whistle', 'Whistle', 0))
    createThread(ue4createstruct('/Script/arr.SplineActor', 'Spline', 0))
    print("(PROGRESS 85%)")
    createThread(ue4createstruct('/Script/Engine.NetDriver', 'NetDriver', 0))
    createThread(ue4createstruct('/Script/Engine.NetConnection', 'NetConnection', 0))
    createThread(ue4createstruct('/Script/Engine.ActorChannel', 'ActorChannel', 0))

    local RunningStructCounter = 0
    while (true) do
        if #RunningStruct == 0 then
            break
        else
            sleep(1)
        end
        RunningStructCounter = RunningStructCounter + 1
        if RunningStructCounter > 180000 then
            break
        end
    end
    LoadStruct()

    print("(PROGRESS 90%)")
    print('All done : ' .. os.time() - starttime .. '\n')
    if not ue_SymbolLookupCallbackID then
        ue_SymbolLookupCallbackID = registerSymbolLookupCallback(ue_SymbolLookupCallback, slNotSymbol)
    end
end