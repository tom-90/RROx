import { Diff } from "deep-diff";

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

export type ValueCommunicator<T> = CommunicatorConfig<
    ( diff: Diff<T>[] ) => void,
    () => T
>;

export function Communicator<
    Config extends CommunicatorConfig<( ...params: any[] ) => void, ( ...params: any[] ) => any>
>( plugin: PluginInfo, key: string ): CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>> {
    return {
        module: plugin,
        key,
        shared: false,
    } as CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>>;
}

export function SharedCommunicator<
    Config extends CommunicatorConfig<( ...params: any[] ) => void, ( ...params: any[] ) => any>
>( plugin: PluginInfo, key: string ): CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>> {
    return {
        module: plugin,
        key,
        shared: true,
    } as CommunicatorType<Exclude<Config['event'], undefined>, Exclude<Config['rpc'], undefined>>;
}