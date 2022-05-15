import {getWorld, setControls} from "../../shared/communicator";
import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {GamepadSettings, IGamepadSettings} from "../../shared";
import {getControlNumber} from "../../shared/controls";

export function handleButtonPress(e: Event, renderer: IPluginRenderer){
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);
    let world = getWorld();

    // @ts-ignore
    let buttonIndex = e.detail.index;
    // @ts-ignore
    let gamepadId = e.detail.gamepad.id;

    let gamepadSettings = settings.get('gamepad.bindings')[gamepadId];
    let buttonSettings = gamepadSettings.buttons[buttonIndex];
    let engine: number|null = gamepadSettings.engine;

    let buttonBinding = buttonSettings.binding;
    if(buttonBinding == 'none') return;

    let buttonMode = buttonSettings.mode;
    let buttonValueUp = buttonSettings.value.up / 100;
    let buttonValueDown = buttonSettings.value.down / 100;
    let bindingNumber = getControlNumber(buttonBinding);

    if(engine == -1) return;

    if(engine){
        let frameCar = world?.frameCars[engine];
        // @ts-ignore
        let currentValue = frameCar?.controls[buttonBinding];

        let valueToBeSet = 0;
        if(buttonMode == 'hold'){
            valueToBeSet = buttonValueDown;
        }else if(buttonMode == 'toggle'){
            valueToBeSet = currentValue == buttonValueUp ? buttonValueDown : buttonValueUp;
        }

        if(valueToBeSet >= -1 && valueToBeSet <= 1){
            setControls(engine, bindingNumber, valueToBeSet);
        }
    }

}