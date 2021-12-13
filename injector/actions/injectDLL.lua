-- Function for injecting DLL

function injectDLLFile(pipe)
    local pathLength = pipe.readDword()
    local path = pipe.readString(pathLength)
    print("(PROGRESS 95%)")
    print("Injecting DLL...")
    injectDLL(path)
    print("Injected DLL.")
    print("(PROGRESS 100%)")
    pipe.writeDword(1)
end