import { Communicator } from "@rrox/api";

export const AutosaveCommunicator = Communicator<{
    rpc: () => void,
}>( PluginInfo, 'autosave-now' );