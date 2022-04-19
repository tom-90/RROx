import { Communicator, ValueCommunicator } from "@rrox/api";

export enum AttachStatus {
    DETACHED,
    INJECTING,
    INITIALIZING,
    LOADING_PLUGINS,
    ATTACHED,
}

export const AttachedCommunicator = Communicator<ValueCommunicator<AttachStatus>>( PluginInfo, 'attach-status' );

export const AttachCommunicator = Communicator<{
    rpc: () => Promise<void>,
}>( PluginInfo, 'attach' );

export const DetachCommunicator = Communicator<{
    rpc: () => Promise<void>,
}>( PluginInfo, 'detach' );