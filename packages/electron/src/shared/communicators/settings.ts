import { Communicator, ValueCommunicator } from "@rrox/api";

export const SettingsCommunicator = Communicator<ValueCommunicator<{
    [ plugin: string ]: any
}>>( PluginInfo, 'settings' );

export const SetSettingsCommunicator = Communicator<{
    event: ( plugin: string, updates: { [ key: string ]: any } ) => void;
}>( PluginInfo, 'set-settings' );