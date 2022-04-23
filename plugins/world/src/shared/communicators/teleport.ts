import { SharedCommunicator } from "@rrox/api";
import { ILocation, ILocation2D } from "../world";

export const TeleportCommunicator = SharedCommunicator<{
    rpc: ( playerName: string, location: ILocation | ILocation2D ) => void,
}>( PluginInfo, 'Teleport' );