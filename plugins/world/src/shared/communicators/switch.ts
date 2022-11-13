import { SharedCommunicator } from "@rrox/api";

export const ChangeSwitchCommunicator = SharedCommunicator<{
    rpc: ( index: number, isSplineTrack?: boolean ) => void,
}>( PluginInfo, 'ChangeSwitch' );