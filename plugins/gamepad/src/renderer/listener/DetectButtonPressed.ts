import {buttonEvents} from "./index";
import {joypadEventTypes} from "../../shared/joypadTypes";

export function DetectButtonPressed(gamepad: Gamepad){
    gamepad.buttons.forEach((button, key) => {
        if(!buttonEvents[gamepad.id]){
            buttonEvents[gamepad.id] = {
                buttons: []
            };
        }

        if(buttonEvents[gamepad.id].buttons[key]){
            buttonEvents[gamepad.id].buttons[key].button = button;
            buttonEvents[gamepad.id].buttons[key].gamepad = gamepad;
        }

        if (!buttonEvents[gamepad.id].buttons[key]) {
            buttonEvents[gamepad.id].buttons[key] = {
                pressed: false,
                pressDetected: false,
                released: false,
                button: button,
                index: key,
                gamepad: gamepad
            };
        }
        buttonEvents[gamepad.id].buttons[key].pressed = button.pressed;

    });
}
export function ButtonPress(gamepadKey: string, key: number, event: joypadEventTypes) {
    if(event.pressed && !event.pressDetected){
        const buttonPressEvent = new CustomEvent('gamepad_button_pressed', {
            detail: event
        });
        window.dispatchEvent(buttonPressEvent);

        event.pressDetected = true;
    }
    if(event.pressDetected && !event.pressed){
        const buttonReleaseEvent = new CustomEvent('gamepad_button_released', {
            detail: event
        });
        window.dispatchEvent(buttonReleaseEvent);

        event.pressDetected = false;
    }
}
