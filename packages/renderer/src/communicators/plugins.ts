import { Communicator, SharedCommunicator, ValueCommunicator } from "@rrox/api";
import { IPlugin } from "../bootstrap";

export const PluginsCommunicator = SharedCommunicator<ValueCommunicator<[ installed: { [ name: string ]: IPlugin }, loaded: string[], loading: boolean ]>>( PluginInfo, 'plugins' );

export const InstallPluginCommunicator = Communicator<{
    rpc: ( plugin: string, confirm?: boolean ) => Promise<string | void>;
}>( PluginInfo, 'install-plugins' );

export const UninstallPluginCommunicator = Communicator<{
    rpc: ( plugin: string, confirm?: boolean ) => Promise<string | void>;
}>( PluginInfo, 'uninstall-plugins' );

export const UpdatePluginCommunicator = Communicator<{
    rpc: ( plugin: string, confirm?: boolean ) => Promise<string | void>;
}>( PluginInfo, 'update-plugins' );

export const DevPluginCommunicator = Communicator<{
    rpc: () => Promise<void>;
}>( PluginInfo, 'dev-plugin' );