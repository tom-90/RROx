import { SharedCommunicator, ValueCommunicator } from "@rrox/api";
import { Communicator } from "@rrox/api";
import { IWorld } from "../world";

export const WorldCommunicator = SharedCommunicator<ValueCommunicator<IWorld>>( PluginInfo, 'world' );

export const PlayerCameraReset = SharedCommunicator<{
    rpc: ( playerName: string) => void,
}>( PluginInfo, 'PlayerCameraReset' );

export const FramecarResetCommunicator = Communicator<{
    rpc: ( index: number) => void,
}>( PluginInfo, 'FramecarReset' );