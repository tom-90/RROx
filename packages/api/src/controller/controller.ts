import { Actions, ActionType } from "./actions";
import { ControllerCommunicator } from "./communicator";

export type SetupFunction = () => void | CleanupFunction | Promise<void | CleanupFunction>;
export type CleanupFunction = () => void | Promise<void>;

export interface IPluginController {
    communicator: ControllerCommunicator;

    /**
     * Retrieves an action to perform on the game.
     *
     * @param action
     */
    getAction<A extends Actions>( action: A ): ActionType<A>;

    /**
     * Determines whether or not RROx is connected to the game.
     */
    isConnected(): boolean;

    /**
     * Fired when RROx connects to the game
     *
     * @param event 
     * @param listener 
     */
    on( event: 'connect', listener: () => void ): void;

    /**
     * Fired when RROx disconnects from the game
     *
     * @param event 
     * @param listener 
     */
    on( event: 'disconnect', listener: () => void ): void;

    /**
     * Adds a setup function that will be called when RROx connects to the game.
     * Optionally this setup can (asynchronously) return a cleanup function that will be called when RROx disconnects from the game,
     * or when the plugins unloads.
     * 
     * If a setup function fails, the plugin will be unloaded after calling the cleanup function of the other setups.
     * 
     * @param callback 
     */
    addSetup( callback: SetupFunction ): void;

    /**
     * Remove a setup function. If this setup function has been called.
     *
     * @param callback 
     * @param cleanup (default: true) When true, the clean-up function will be called if the setup function had previously been called.
     */
    removeSetup( callback: SetupFunction, cleanup?: boolean ): void;
}