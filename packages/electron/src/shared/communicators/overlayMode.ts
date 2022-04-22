import { Communicator, OverlayMode, ValueCommunicator } from "@rrox/api";

export const OverlayModeCommunicator = Communicator<ValueCommunicator<OverlayMode>>( PluginInfo, 'overlay-mode' );