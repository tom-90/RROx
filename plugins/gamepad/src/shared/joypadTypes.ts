export type joypadEventTypes = {
    pressed: boolean,
    pressDetected: boolean,
    released: boolean,
    button: GamepadButton|null,
    index: number,
    gamepad: Gamepad|null
};
export type joypadType = {
    buttons: joypadEventTypes[]
};
export type gamepadsType = {
    [key: string]: joypadType
};