import { Communicator } from "@rrox/api";

export const OpenSaveFolderCommunicator = Communicator<{
    rpc: () => void,
}>( PluginInfo, 'open-save-folder' );