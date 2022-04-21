import { Communicator } from "@rrox/api";

export const RestartCommunicator = Communicator<{
    rpc: () => Promise<void>;
}>( PluginInfo, 'restart' );