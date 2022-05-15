import { Diff } from "deep-diff";

/**
 * Internal RROx communicator type containing all information for the declared communicator.
 */
export interface CommunicatorType<EventFunction extends ( ...params: any[] ) => void, RPCFunction extends ( ...params: any[] ) => any> {
    module: PluginInfo;
    key: string;
    shared: boolean;

    // Non-existent property to store event and rpc functions
    readonly _eType: EventFunction;
    readonly _rType: RPCFunction;
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type CommunicatorEventParameters<C extends CommunicatorType<( ...p: any[] ) => void, any>> = Parameters<C[ '_eType' ]>;
export type CommunicatorRPCFunction<C extends CommunicatorType<any, ( ...p: any[] ) => any>> = ( ...args: Parameters<C[ '_rType' ]> ) => Promise<Awaited<ReturnType<C[ '_rType' ]>>>;

/**
 * The CommunicatorConfig can be used in the `Communicator` and `SharedCommunicator` functions
 * to declare the types of the events and RPCs that can be sent using the declared communicators.
 */
export interface CommunicatorConfig<EventFunction extends ( ...params: any[] ) => void, RPCFunction extends ( ...params: any[] ) => any> {
    /**
     * Function defining the parameters that will be passed with the event.
     */
    event?: EventFunction;

    /**
     * Function defining the way the remote procedure should be called.
     */
    rpc?: RPCFunction;
}

/**
 * The ValueCommunicator type allows you to set the type for the `Communicator` and `SharedCommunicator` functions.
 */
export type ValueCommunicator<T> = CommunicatorConfig<
    ( diff: Diff<T>[] ) => void,
    () => T
>;

/**
 * This function declares a communicator to be used by your plugin.
 * For more information about communicators, look in the documentation
 * {@link https://rrox-docs.tom90.nl/basics/communicators}
 * 
 * @param plugin Tells RROx which plugin defined this communicator. You can use the global constant `PluginInfo` for this parameter.
 * @param key Must be unique for all communicators within a plugin.
 * 
 * @returns Communicator type that can be used in the renderer and controller
 */
export function Communicator<
    Config extends CommunicatorConfig<( ...params: any[] ) => void, ( ...params: any[] ) => any>
>( plugin: PluginInfo, key: string ): CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>> {
    return {
        module: plugin,
        key,
        shared: false,
    } as CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>>;
}

/**
 * This function declares a shared communicator to be used by your plugin.
 * For more information about communicators, look in the documentation
 * {@link https://rrox-docs.tom90.nl/basics/communicators}
 * 
 * @param plugin Tells RROx which plugin defined this communicator. You can use the global constant `PluginInfo` for this parameter.
 * @param key Must be unique for all communicators within a plugin.
 * 
 * @returns Communicator type that can be used in the renderer and controller
 */
export function SharedCommunicator<
    Config extends CommunicatorConfig<( ...params: any[] ) => void, ( ...params: any[] ) => any>
>( plugin: PluginInfo, key: string ): CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>> {
    return {
        module: plugin,
        key,
        shared: true,
    } as CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>>;
}