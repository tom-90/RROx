import {getWorld, setControls} from "../../shared/communicator";
import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {GamepadSettings, IGamepadSettings} from "../../shared";
import {getControlNumber} from "../../shared/controls";

export function handleButtonRelease(e: Event, renderer: IPluginRenderer){
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);

    // @ts-ignore
    let buttonIndex = e.detail.index;
    // @ts-ignore
    let gamepadId = e.detail.gamepad.id;

    let gamepadSettings = settings.get('gamepad.bindings')[gamepadId];
    let buttonSettings = gamepadSettings.buttons[buttonIndex];
    let engine: string|number = gamepadSettings.engine;

    let buttonBinding = buttonSettings.binding;
    if(buttonBinding == 'none') return;

    let buttonMode = buttonSettings.mode;
    let buttonValueUp = buttonSettings.value.up / 100;
    let bindingNumber = getControlNumber(buttonBinding);

    let engineNumber = null;

    if(typeof engine == "number"){
        engineNumber = engine;
    }else{
        //TODO
        // add current follow
    }

    if(engineNumber){
        if(buttonMode == 'hold'){
            if(buttonValueUp >= -1 && buttonValueUp <= 1){
                setControls(parseInt(engineNumber), bindingNumber, buttonValueUp);
            }
        }
    }

}