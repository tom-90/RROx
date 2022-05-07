type triggerValueType = {
    [key: number]: number
}
type triggerValues = {
    [key: string]: triggerValueType
}

let triggerValues = {} as triggerValues;

export function DetectTriggerChange(gamepad: Gamepad){

    gamepad.buttons.forEach((button, key) => {
        if(key != 6 && key != 7) return;

        if(triggerValues[gamepad.id] == undefined) {
            triggerValues[gamepad.id] = {};
            if (triggerValues[gamepad.id][key] == undefined) {
                triggerValues[gamepad.id][key] = button.value;
            }
        }

        if(triggerValues[gamepad.id][key] != button.value){
            triggerValues[gamepad.id][key] = button.value;

            const buttonPressEvent = new CustomEvent('gamepad_trigger_changed', {
                detail: {
                    index: key,
                    value: button.value,
                    button: button,
                    gamepad: gamepad
                }
            });
            window.dispatchEvent(buttonPressEvent);
        }

    });
}