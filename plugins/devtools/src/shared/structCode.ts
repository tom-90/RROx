import { Communicator } from "@rrox/api";
import { StructListType } from "./structList";

export const StructCodeCommunicator = Communicator<{
    /**
     * Function defining the way the remote procedure should be called.
     */
    rpc?: ( structName: string ) => [ code: string, links: { [ key: string ]: string } ];
}>( PluginInfo, 'StructCode' );