import {IPluginRenderer, ValueConsumer} from "@rrox/api";
import {FrameCarControl, IWorld, SetControlsCommunicator, WorldCommunicator} from "@rrox-plugins/world/shared";

let publicRenderer: IPluginRenderer|null = null;
let worldData: IWorld | undefined;

export function registerCommunicator(renderer: IPluginRenderer){
    publicRenderer = renderer;
    let worldValueConsumer = new ValueConsumer(renderer.communicator, WorldCommunicator);
    worldData = worldValueConsumer.getValue();
    worldValueConsumer.addListener('update', (data) => {
        worldData = data;
    });
}

export const setControls = (engine: number, type: FrameCarControl, value: number) => {
    publicRenderer?.communicator.rpc(SetControlsCommunicator, engine, type, value);
}

export const getWorld = () => {
    return worldData;
}

