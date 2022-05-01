type joypadEventTypes = {
    pressed: boolean,
    released: boolean,
    button: GamepadButton|null,
    index: number,
    gamepad: Gamepad|null
};
type joypadType = {
    buttons: joypadEventTypes[]
};
type gamepadsType = {
    [key: string]: joypadType
};