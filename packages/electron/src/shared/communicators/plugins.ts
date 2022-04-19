import { Communicator } from "@rrox/api";
import { IPlugin } from "../../renderer/bootstrap/plugins";

export const PluginsCommunicator = Communicator<{
    rpc  : () => Promise<[ installed: { [ name: string ]: IPlugin }, loaded: string[] ]>;
    event: ( installed: { [ name: string ]: IPlugin }, loaded: string[] ) => void;
}>( PluginInfo, 'plugins' );

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