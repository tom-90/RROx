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

    let engine: string|number = gamepadSettings.engine;

    if(!buttonSettings) return;

    ////////////////////////////////////////////////////////////
    let binding = buttonSettings.binding;
    let value = buttonSettings.value;

    let engineNumber = null;

    if(typeof engine == "number"){
        engineNumber = engine;
    }else{
        //TODO
        // add current follow
    }

    if(engineNumber){
        if(binding == 'none') return;

        if(frameCarValues[engineNumber] == undefined){
            frameCarValues[engineNumber] = {};
            if(frameCarValues[engineNumber][binding] == undefined){
                frameCarValues[engineNumber][binding] = 0;
            }
        }

        if(value == "controller_value"){
            frameCarValues[engineNumber][binding] = controllerValue;
        }else if(value == "controller_change"){
            frameCarValues[engineNumber][binding] = frameCarValues[engineNumber][binding] + (controllerValue / 50);
            if(frameCarValues[engineNumber][binding] > 1) frameCarValues[engineNumber][binding] = 1;
            if(frameCarValues[engineNumber][binding] < -1) frameCarValues[engineNumber][binding] = -1;
        }

        if(frameCarValues[engineNumber] != undefined && frameCarValues[engineNumber][binding] != undefined){
            if(frameCarValues[engineNumber][binding] >= -1 && frameCarValues[engineNumber][binding] <= 1){
                let bindingNumber = getControlNumber(binding);
                setControls(parseInt(String(engineNumber)), bindingNumber, frameCarValues[engineNumber][binding]);
            }
        }
    }

}