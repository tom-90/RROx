import { SharedCommunicator } from "@rrox/api";

export const SetControlsCommunicator = SharedCommunicator<{
    rpc: ( index: number, type: FrameCarControl, value: number ) => void,
}>( PluginInfo, 'SetControls' );

export enum FrameCarControl {
    Regulator  = 1,
    Reverser   = 2,
    Brake      = 3,
    Whistle    = 4,
    Generator  = 5,
    Compressor = 6,
}