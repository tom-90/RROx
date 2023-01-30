import { SharedCommunicator } from "@rrox/api";
import { IStorage } from "../world";

export const storageUseCrane = SharedCommunicator<{
	rpc: ( sindustryIndex: number, storageOutputIndex: number, craneNumber: number, loadFullCar: boolean ) => void,
}>( PluginInfo, 'storageUseCrane' );