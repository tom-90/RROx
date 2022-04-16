import { Communicator } from "@rrox/api";

export const ChangeSwitchCommunicator = Communicator<{
    rpc: ( index: number ) => void,
}>( PluginInfo, 'ChangeSwitch' );