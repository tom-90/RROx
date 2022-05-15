import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {getControlNumber} from "../../shared/controls";
import {setControls} from "../../shared/communicator";
import {GamepadSettings, IGamepadSettings} from "../../shared";

type frameCarControl = {
    [key: string]: number
}
type frameCarValueTypes = {
    [key: number]: frameCarControl
}
let frameCarValues = {} as frameCarValueTypes;

export const handleTriggerChange = (e: Event, renderer: IPluginRenderer) => {
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);

    // @ts-ignore
    let buttonIndex = e.detail.index;
    // @ts-ignore
    let gamepadId = e.detail.gamepad.id;
    // @ts-ignore
    let controllerValue = e.detail.value;

    let gamepadSettings = settings.get('gamepad.bindings')[gamepadId];
    let buttonSettings = null;
    if(buttonIndex == 6) buttonSettings = gamepadSettings.left.trigger;
    if(buttonIndex == 7) buttonSettings = gamepadSettings.right.trigger;

    let engine: number|null = gamepadSettings.engine;

    if(!buttonSettings) return;

    ////////////////////////////////////////////////////////////
    let binding = buttonSettings.binding;
    let value = buttonSettings.value;

    if(engine == -1) return;

    if(engine){
        if(binding == 'none') return;

        if(frameCarValues[engine] == undefined){
            frameCarValues[engine] = {};
            if(frameCarValues[engine][binding] == undefined){
                frameCarValues[engine][binding] = 0;
            }
        }

        if(value == "controller_value"){
            frameCarValues[engine][binding] = controllerValue;
        }else if(value == "controller_change"){
            frameCarValues[engine][binding] = frameCarValues[engine][binding] + (controllerValue / 50);
            if(frameCarValues[engine][binding] > 1) frameCarValues[engine][binding] = 1;
            if(frameCarValues[engine][binding] < -1) frameCarValues[engine][binding] = -1;
        }

        if(frameCarValues[engine] != undefined && frameCarValues[engine][binding] != undefined){
            if(frameCarValues[engine][binding] >= -1 && frameCarValues[engine][binding] <= 1){
                let bindingNumber = getControlNumber(binding);
                setControls(engine, bindingNumber, frameCarValues[engine][binding]);
            }
        }
    }

}