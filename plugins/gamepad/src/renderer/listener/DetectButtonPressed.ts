import {buttonEvents} from "./index";

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
        if(button.value > 0.01){
            buttonEvents[gamepad.id].buttons[key] = {
                pressed: true,
                released: false,
                button: button,
                index: key,
                gamepad: gamepad
            };
        }
    });
}
export function ButtonPress(gamepadKey: string, key: number, event: joypadEventTypes) {
    if(event.pressed){
        const buttonPressEvent = new CustomEvent('gamepad_button_pressed', {
            detail: event
        });
        window.dispatchEvent(buttonPressEvent);

        event.released = true;
        event.pressed = false;
    }

    else if(event.released){
        const buttonReleaseEvent = new CustomEvent('gamepad_button_released', {
            detail: event
        });
        window.dispatchEvent(buttonReleaseEvent);

        event.released = false;
    }
}
