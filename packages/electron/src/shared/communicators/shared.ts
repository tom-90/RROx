import { Communicator, ValueCommunicator } from "@rrox/api";

export enum ShareMode {
    NONE  ,
    HOST  ,
    CLIENT,
}

export interface ShareKeys {
    public?: string;
    private?: string;
}

export const ShareModeCommunicator = Communicator<ValueCommunicator<ShareMode>>( PluginInfo, 'share-mode' );
export const ShareKeysCommunicator = Communicator<ValueCommunicator<ShareKeys>>( PluginInfo, 'share-keys' );

export const ShareMessagesCommunicator = Communicator<{
    event: ( channel: string, ...params: any[] ) => void,
    rpc  : ( channel: string, ...params: any[] ) => any,
}>( PluginInfo, 'share-messages' );

export const ShareConnectHostCommunicator = Communicator<{
    rpc: ( connect?: boolean ) => void
}>( PluginInfo, 'share-host' );

export const ShareConnectClientCommunicator = Communicator<{
    rpc: ( key: string | null ) => void
}>( PluginInfo, 'share-client' );