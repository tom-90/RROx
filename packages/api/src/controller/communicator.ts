import { CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType } from "../shared";
import { Diff } from "deep-diff";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export interface ControllerCommunicator {
    /**
     * Registers a listener for a specific communicator.
     * The listener will receive events sent by a renderer for the communicator.
     * The returned function can be used to destroy the created listener.
     * 
     * @param communicator Communicator to activate the listener for
     * @param listener Listener that should be called for each received event
     * @returns Function that can be called to unregister the listener
     */
    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void ): () => void;
    
    /**
     * Emits an event for the specified communicator with the given arguments.
     * The event will be received by the registered listeners on the renderers.
     *
     * @param communicator Communicator to emit the event for
     * @param args Arguments to pass with the event
     */
    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C, ...args: CommunicatorEventParameters<C> ): void;
    
    /**
     * Handles rpc (remote producure call) calls that are executed by the renderer.
     * There can only be one handler for each communicator.
     * The returned function can be used to destroy the created handler.
     * 
     * @param communicator Communicator to handle rpc's for
     * @param handler Handler that will handle rpc's
     * @returns Function that can be called to unregister the handler
     */
    handle<C extends CommunicatorType<any, ( ...p: any[] ) => any>>( communicator: C, handler: ( ...args: Parameters<CommunicatorRPCFunction<C>> ) => ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>> ): () => void;

    /**
     * Creates a value provider for a communicator.
     * A value provider can provide updates to renderers in an optimized way by only sending changed properties over the network.
     * 
     * @param communicator Value communicator for which to provide a value
     * @param initialValue Optional initial value
     */
    provideValue<T>( communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T ): ValueProvider<T>;
}

export interface ValueProvider<T> {
    /**
     * Get the latest value stored in the value provider.
     * If not value is stored, undefined is returned.
     */
    getValue(): T | undefined;

    /**
     * Provide a new value and send it to the renderers.
     *
     * @param value Value to provide
     */
    provide( value: T ): void;
}