import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {GamepadSettings, IGamepadSettings} from "../../shared";
import {getControlNumber} from "../../shared/controls";
import {setControls} from "../../shared/communicator";

type frameCarControl = {
    [key: string]: number
}
type frameCarValueTypes = {
    [key: number]: frameCarControl
}
let frameCarValues = {} as frameCarValueTypes;

export const handleAxisMoved = (e: Event, renderer: IPluginRenderer) => {
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);

    // @ts-ignore
    let gamepadId = e.detail.gamepad.id;
    // @ts-ignore
    let stick = e.detail.stick;
    // @ts-ignore
    let axisName = e.detail.axisName;
    // @ts-ignore
    let position = e.detail.position;
    // @ts-ignore
    let axisValue = e.detail.axisMovementValue;

    let gamepadSettings = settings.get('gamepad.bindings')[gamepadId];
    let axisSettings = null;
    if(stick == 'left') axisSettings = gamepadSettings.left;
    if(stick == 'right') axisSettings = gamepadSettings.right;

    let engine: string|number = gamepadSettings.engine;

    if(!axisSettings) return;

    ////////////////////////////////////////////////////////////
    // @ts-ignore
    let binding = axisSettings[axisName].binding;
    // @ts-ignore
    let value = axisSettings[axisName].value;

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
            frameCarValues[engineNumber][binding] = axisValue;
        }else if(value == "controller_change"){
            frameCarValues[engineNumber][binding] = frameCarValues[engineNumber][binding] + (axisValue / 50);
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