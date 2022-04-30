import { Communicator } from "@rrox/api";

export const OpenLogFileCommunicator = Communicator<{
    rpc: () => Promise<void>;
}>( PluginInfo, 'open-log-file' );