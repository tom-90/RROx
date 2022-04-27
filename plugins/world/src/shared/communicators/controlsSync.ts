import { Communicator } from "@rrox/api";

export const SetControlsSyncCommunicator = Communicator<{
    rpc: ( index: number, enabled?: boolean ) => void,
}>( PluginInfo, 'SetControlsSync' );