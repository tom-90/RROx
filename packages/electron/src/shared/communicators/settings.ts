import { Communicator, SharedCommunicator, ValueCommunicator } from "@rrox/api";

export const SettingsCommunicator = SharedCommunicator<ValueCommunicator<{
    [ plugin: string ]: any
}>>( PluginInfo, 'settings' );

export const SetSettingsCommunicator = Communicator<{
    event: ( plugin: string, updates: { [ key: string ]: any } ) => void;
}>( PluginInfo, 'set-settings' );

export const LocalSettingsCommunicator = Communicator<ValueCommunicator<{
    [ plugin: string ]: any
}>>( PluginInfo, 'local-settings' );

export const SetLocalSettingsCommunicator = Communicator<{
    event: ( plugin: string, updates: { [ key: string ]: any } ) => void;
}>( PluginInfo, 'set-local-settings' );