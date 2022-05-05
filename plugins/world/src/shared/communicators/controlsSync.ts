import { SharedCommunicator } from "@rrox/api";

export const SetControlsSyncCommunicator = SharedCommunicator<{
    rpc: ( index: number, enabled?: boolean ) => void,
}>( PluginInfo, 'SetControlsSync' );