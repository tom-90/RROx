export enum controls {
    REGULATOR = "regulator",
    REVERSER = "reverser",
    BRAKE = "brake",
    WHISTLE = "whistle",
    GENERATOR = "generator",
    COMPRESSOR = "compressor",
}

export const controlNames = {
    [controls.REGULATOR]: "Regulator",
    [controls.REVERSER]: "Reverser",
    [controls.BRAKE]: "Brake",
    [controls.WHISTLE]: "Whistle",
    [controls.GENERATOR]: "Generator",
    [controls.COMPRESSOR]: "Compressor",
};

export const getControlNumber = (controlName: string) => {
    let controlNumber: number = 0;
    switch (controlName){
        case controls.REGULATOR:
            controlNumber = 1
            break
        case controls.REVERSER:
            controlNumber =  2
            break
        case controls.BRAKE:
            controlNumber =  3
            break
        case controls.WHISTLE:
            controlNumber =  4
            break
        case controls.GENERATOR:
            controlNumber =  5
            break
        case controls.COMPRESSOR:
            controlNumber =  6
            break
    }
    return controlNumber;
}