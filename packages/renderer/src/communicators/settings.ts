import { Communicator, SharedCommunicator, ValueCommunicator } from "@rrox/api";

export const SettingsCommunicator = SharedCommunicator<ValueCommunicator<{
    [ plugin: string ]: any
}>>( PluginInfo, 'settings' );

export const SetSettingsCommunicator = Communicator<{
    event: ( plugin: string, updates: { [ key: string ]: any } ) => void;
}>( PluginInfo, 'set-settings' );