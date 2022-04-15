import { Communicator } from "@rrox/api";
import { IPlugin } from "../../renderer/bootstrap/plugins";

export const PluginsCommunicator = Communicator<{
    rpc  : () => Promise<[ installed: { [ name: string ]: IPlugin }, loaded: string[] ]>;
    event: ( installed: { [ name: string ]: IPlugin }, loaded: string[] ) => void;
}>( '@rrox/electron', 'plugins' );