import { SharedCommunicator } from "@rrox/api";

export const StructCodeCommunicator = SharedCommunicator<{
    rpc?: ( structName: string ) => [ code: string, links: { [ key: string ]: string } ];
}>( PluginInfo, 'StructCode' );