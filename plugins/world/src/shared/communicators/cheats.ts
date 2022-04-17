import { Communicator } from "@rrox/api";

export const GetPlayerCheats = Communicator<{
    rpc: ( playerName: string ) => ICheats | undefined,
}>( PluginInfo, 'GetPlayerCheats' );

export const SetPlayerCheats = Communicator<{
    rpc: ( playerName: string, cheats: ICheats ) => void,
}>( PluginInfo, 'SetPlayerCheats' );

export const SetMoneyXPCheats = Communicator<{
    rpc: ( playerName: string, money?: number, xp?: number ) => void,
}>( PluginInfo, 'SetMoneyXPCheats' );

export interface ICheats {
    flySpeed?: number;
    walkSpeed?: number;
}