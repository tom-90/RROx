import {ButtonPress, DetectButtonPressed} from "./DetectButtonPressed";
import {DetectAxisMoved} from "./DetectAxisMoved";
import {handleButtonPress} from "./handleButtonPress";
import {handleButtonRelease} from "./handleButtonRelease";
import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {gamepadsType} from "../../shared/joypadTypes";
import {handleTriggerChange} from "./handleTriggerChange";
import {DetectTriggerChange} from "./DetectTriggerChange";
import {handleAxisMoved} from "./handleAxisMoved";
import {GamepadSettings, IGamepadSettings} from "../../shared";
import {DetectLowValue} from "./DetectLowValue";

let interval: NodeJS.Timer | null = null;
let controllers: (Gamepad|null)[] = [];
export let buttonEvents = {} as gamepadsType;

export function LoadListener(renderer: IPluginRenderer) {
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);

    interval = setInterval(() => {
        if(settings.get('gamepad.enabled')){
            gameLoop(renderer);
        }
    }, 50);

    window.addEventListener('gamepad_button_pressed', (e) => handleButtonPress(e, renderer));
    window.addEventListener('gamepad_button_released', (e) => handleButtonRelease(e, renderer));
    window.addEventListener('gamepad_trigger_changed', (e) => handleTriggerChange(e, renderer));
    window.addEventListener('gamepad_axis_move', (e) => handleAxisMoved(e, renderer));
}

function gameLoop(renderer: IPluginRenderer){
    const gamepads = navigator.getGamepads();
    controllers = Array.from(gamepads);

    if(controllers.length == 0) return;

    controllers.forEach((gamepad, index) => {
        if(gamepad){
            DetectButtonPressed(gamepad);
            DetectAxisMoved(gamepad);
            DetectTriggerChange(gamepad);
            DetectLowValue(gamepad, renderer);

            if(buttonEvents[gamepad.id]) {
                let gamepadEvents = buttonEvents[gamepad.id];
                for (let key = 0; key < gamepadEvents.buttons.length; key++) {
                    let event = gamepadEvents.buttons[key];
                    if(event){
                        ButtonPress(gamepad.id, key, event);
                    }
                }
            }

        }
    });
}

export function UnloadListener(){
    if(interval != null){
        clearInterval(interval);
    }
}


