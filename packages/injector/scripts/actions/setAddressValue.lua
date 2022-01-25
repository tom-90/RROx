function setAddressValue(pipe)
    local address = pipe.readQword()

    local mode = pipe.readDword()

    if mode == 1 then -- Write single byte
        local value = pipe.readByte()
        writeBytes(address, value)
    elseif mode == 2 then -- Write Float
        local value = pipe.readFloat()
        writeFloat(address, value)
    end
end
