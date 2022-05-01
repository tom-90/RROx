import {IPluginRenderer} from "@rrox/api";
import {FrameCarControl, SetControlsCommunicator} from "@rrox-plugins/world/shared";
import {ButtonPress, DetectButtonPressed} from "./DetectButtonPressed";
import {DetectAxisMoved} from "./DetectAxisMoved";

let interval: NodeJS.Timer | null = null;
let controllers: (Gamepad|null)[] = [];
export let buttonEvents = {} as gamepadsType;
let publicRenderer: IPluginRenderer|null = null

export function LoadListener(renderer: IPluginRenderer) {
    publicRenderer = renderer
    //let world = new ValueConsumer(renderer.communicator, WorldCommunicator);

    interval = setInterval(() => {
        gameLoop();
    }, 50);
}

const setControls = (engine: number, type: FrameCarControl, value: number) => {
    publicRenderer?.communicator.rpc(SetControlsCommunicator, engine, type, value).then(r => {
        console.log(`${type} set to ${value}`);
    });
}

function gameLoop(){
    const gamepads = navigator.getGamepads();
    controllers = Array.from(gamepads);

    if(controllers.length == 0) return;

    controllers.forEach((gamepad, index) => {
        if(gamepad){
            DetectButtonPressed(gamepad);
            DetectAxisMoved(gamepad);

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

window.addEventListener('gamepad_button_pressed', (e) => {
    console.log('button pressed');

    // @ts-ignore
    console.log(e.detail.button.value);

    // @ts-ignore
    setControls(0, FrameCarControl.Whistle, e.detail.button.value)
});
window.addEventListener('gamepad_button_released', (e) => {
    console.log('button released');

    // @ts-ignore
    console.log(e.detail.button.value);
});
window.addEventListener('gamepad_axis_move', (e) => {
    console.log(' axis move');

    // @ts-ignore
    console.log(e.detail);
});

export function UnloadListener(){
    if(interval != null){
        clearInterval(interval);
    }
}


