import { Communicator, IStruct } from "@rrox/api";

export const REPLCommunicator = Communicator<{
    event: ( output: string ) => void;
    rpc: ( input: string ) => void;
}>( PluginInfo, 'REPL' );

export const ObjectsListCommunicator = Communicator<{
    rpc: () => string[];
}>( PluginInfo, 'Objects' );

export const ObjectDetailsCommunicator = Communicator<{
    rpc: ( name: string ) => {
        [ key: string ]: any,
        __name: string,
        __metadata: IStruct
    };
}>( PluginInfo, 'ObjectDetails' );