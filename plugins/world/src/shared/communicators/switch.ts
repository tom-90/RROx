import { SharedCommunicator } from "@rrox/api";

export const ChangeSwitchCommunicator = SharedCommunicator<{
    rpc: ( index: number ) => void,
}>( PluginInfo, 'ChangeSwitch' );