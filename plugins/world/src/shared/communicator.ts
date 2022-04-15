import { Communicator, ValueCommunicator } from "@rrox/api";
import { IWorld } from "./world";

export const WorldCommunicator = Communicator<ValueCommunicator<IWorld>>( '@rrox/world', 'World' );