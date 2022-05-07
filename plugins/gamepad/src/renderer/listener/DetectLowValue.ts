import {IPluginRenderer, SettingsStore} from "@rrox/api";
import {GamepadSettings, IGamepadSettings, vibrationWarningOption} from "../../shared";
import {getWorld} from "../../shared/communicator";

type controllerVibrationValues = {
    [key: string]: boolean;
}
type controllers = {
    [key: string]: controllerVibrationValues
}
let controllerVibrations = {} as controllers;

export function DetectLowValue(gamepad: Gamepad, renderer: IPluginRenderer){
    let settings: SettingsStore<IGamepadSettings> = renderer.settings.get(GamepadSettings);
    let world = getWorld();

    let gamepadId = gamepad.id;

    let gamepadSettings = settings.get('gamepad.bindings')[gamepadId];
    let engine: string|number = gamepadSettings.engine;
    let engineNumber: string | number | null = null;

    if(typeof engine == "number"){
        engineNumber = engine;
    }else{
        //TODO
        // add current follow
    }

    if(engineNumber){
        let vibrateOptions = settings.get("gamepad.vibrationWarning")[gamepadId];
        let frameCar = world?.frameCars[engineNumber];

        Object.keys(vibrateOptions).forEach(key => {
            // @ts-ignore
            let vibrateOption: vibrationWarningOption = vibrateOptions[key];

            if(controllerVibrations[gamepadId] == undefined){
                controllerVibrations[gamepadId] = {};
            }
            if(controllerVibrations[gamepadId][key] == undefined){
                controllerVibrations[gamepadId][key] = false;
            }

            let frameCarOption = null;
            let frameCarOptionMax = null;
            switch (key) {
                case "boilerPressure":
                    // @ts-ignore
                    frameCarOption = frameCar.boiler.pressure;
                    // @ts-ignore
                    frameCarOptionMax = frameCar.boiler.maxPressure;
                    break;
                case "airPressure":
                    // @ts-ignore
                    frameCarOption = frameCar.compressor.airPressure;
                    frameCarOptionMax = 100;
                    break;
                case "waterTemperature":
                    // @ts-ignore
                    frameCarOption = frameCar.boiler.waterTemperature;
                    frameCarOptionMax = 110;
                    break;
                case "waterLevel":
                    // @ts-ignore
                    frameCarOption = frameCar.boiler.waterAmount;
                    // @ts-ignore
                    frameCarOptionMax = frameCar.boiler.maxWaterAmount;
                    break;
                case "fireTemperature":
                    // @ts-ignore
                    frameCarOption = frameCar.boiler.fireTemperature;
                    frameCarOptionMax = 400;
                    break;
                case "fuelAmount":
                    // @ts-ignore
                    frameCarOption = frameCar.boiler.fuel;
                    // @ts-ignore
                    frameCarOptionMax = frameCar.boiler.maxFuel;
                    break;
                default:
                    return;
            }

            if(frameCarOption && frameCarOptionMax){
                if(vibrateOption.value == 0) return

                if(vibrateOption.type == "value") {
                    if(frameCarOption < vibrateOption.value){
                        if(!controllerVibrations[gamepadId][key]){
                            controllerVibrations[gamepadId][key] = true;
                            vibrateGamepadWithPattern(gamepad, vibrateOption.pattern, key);
                        }
                    }
                }else if(vibrateOption.type == "percent"){
                    let percentage = frameCarOption / frameCarOptionMax * 100;
                    if(percentage < vibrateOption.value){
                        if(!controllerVibrations[gamepadId][key]){
                            controllerVibrations[gamepadId][key] = true;
                            vibrateGamepadWithPattern(gamepad, vibrateOption.pattern, key);
                        }
                    }
                }
            }
        });
    }
}

const vibrateGamepadWithPattern = (gamepad: Gamepad, pattern: string, key: string) => {
    switch (pattern) {
        case "pulse_1":
            vibrateGamepad(gamepad, 500);
            break;
        case "pulse_2":
            vibrateGamepad(gamepad, 500);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, 500 + 200);
            break;
        case "pulse_3":
            vibrateGamepad(gamepad, 500);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, 500 + 200);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, (500 + 200) * 2);
            break;
        case "pulse_4":
            vibrateGamepad(gamepad, 500);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, 500 + 200);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, (500 + 200) * 2);
            setTimeout(() => {
                vibrateGamepad(gamepad, 500);
            }, (500 + 200) * 3);
            break;
        case "long":
            vibrateGamepad(gamepad, 1000);
            break;
        case "very_long":
            vibrateGamepad(gamepad, 2000);
            break;
    }
    setTimeout(() => {
        controllerVibrations[gamepad.id][key] = false;
    }, 1000 * 15);
}

const vibrateGamepad = (gamepad: Gamepad, duration: number, weakMagnitude: number = 1, strongMagnitude: number = 1) => {
    console.log(`Vibrating gamepad ${gamepad.id} for ${duration}ms`);
    // @ts-ignore
    gamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: duration,
        weakMagnitude: weakMagnitude,
        strongMagnitude: strongMagnitude,
    });
}