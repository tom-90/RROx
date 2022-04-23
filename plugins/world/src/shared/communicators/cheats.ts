import { SharedCommunicator } from "@rrox/api";

export const GetPlayerCheats = SharedCommunicator<{
    rpc: ( playerName: string ) => ICheats | undefined,
}>( PluginInfo, 'GetPlayerCheats' );

export const SetPlayerCheats = SharedCommunicator<{
    rpc: ( playerName: string, cheats: ICheats ) => void,
}>( PluginInfo, 'SetPlayerCheats' );

export const SetMoneyXPCheats = SharedCommunicator<{
    rpc: ( playerName: string, money?: number, xp?: number ) => void,
}>( PluginInfo, 'SetMoneyXPCheats' );

export interface ICheats {
    flySpeed?: number;
    walkSpeed?: number;
}