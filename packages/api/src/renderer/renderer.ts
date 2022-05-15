import { RendererCommunicator } from "./communicator";
import { IRegistrationController, Registration, RegistrationParameters, RegistrationType } from "./registrations";
import { RendererSettingsController } from "./settings";
import { RendererMode, ShareMode } from "./types";

/**
 * The Plugin Renderer interface exposes all primary RROx API's that can be used in the renderer.
 */
export interface IPluginRenderer {
    /**
     * The communicator allows you to communicate with the controller
     */
    communicator: RendererCommunicator;

    /**
     * The settings API allows you to retrieve the values for declared settings objects.
     */
    settings: RendererSettingsController;

    /**
     * The mode the renderer is currently running in
     */
    rendererMode: RendererMode;

    /**
     * The sharing mode the user has selected
     */
    shareMode: ShareMode;

    /**
     * Register the plugin to an existing registration type.
     *
     * @param type Registration type for which to register
     * @param parameters Parameters for the registration
     * @returns Registration which can be used for unregistering
     */
    register<R extends RegistrationType<( ...params: any[] ) => void>>( type: R, ...parameters: RegistrationParameters<R> ): Registration<R>;

    /**
     * Unregister a registration.
     * 
     * @param registration Registration to unregister.
     */
    unregister<R extends RegistrationType<( ...params: any[] ) => void>>( registration: Registration<R> ): void;

    /**
     * Get controller for an registration
     * 
     * @param registration Registration to get the controller for
     */
    getRegistrationController<R extends RegistrationType<( ...params: any[] ) => void>>( registration: R ): IRegistrationController<R>;

    /**
     * Reload the plugin
     */
    reload(): void;
}