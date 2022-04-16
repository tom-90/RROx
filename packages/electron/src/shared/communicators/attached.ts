import { Communicator } from "@rrox/api";

export const AttachedCommunicator = Communicator<{
    rpc  : () => Promise<boolean>;
    event: ( attached: boolean ) => void;
}>( PluginInfo, 'attached' );