import { CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType } from "../communicator";

export interface RendererCommunicator {
    /**
     * Registers a listener for a specific communicator.
     * The listener will receive events sent by a controller for the communicator.
     * The returned function can be used to destroy the created listener.
     * 
     * @param communicator Communicator to activate the listener for
     * @param listener Listener that should be called for each received event
     * @returns Function that can be called to unregister the listener.
     */
    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void ): () => void;
    
    /**
     * Emits an event for the specified communicator with the given arguments.
     * The event will be received by the registered listeners on the controller.
     *
     * @param communicator Communicator to emit the event for
     * @param args Arguments to pass with the event
     */
    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C, ...args: CommunicatorEventParameters<C> ): void;

    /**
     * Calls an rpc (remote producure call) on the controller,
     * and returns a promise that resolves the returned value by the controller.
     * 
     * @param communicator Communicator to call the rpc on
     * @param args Arguments to pass to the rpc
     */
    rpc<C extends CommunicatorType<any, ( ...p: any[] ) => any>>( communicator: C, ...args: Parameters<CommunicatorRPCFunction<C>> ): ReturnType<CommunicatorRPCFunction<C>>;
}