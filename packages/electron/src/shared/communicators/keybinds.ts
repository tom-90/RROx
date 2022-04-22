import { Communicator } from "@rrox/api";

export const KeybindsCommunicator = Communicator<{
    rpc  : ( keybindsOrId: number[] | number ) => Promise<number>,
    event: ( keybindId: number ) => void,
}>( PluginInfo, 'keybinds' );