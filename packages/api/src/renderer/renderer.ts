import { RendererCommunicator } from "./communicator";
import { IRegistrationController, Registration, RegistrationParameters, RegistrationType } from "./registrations";
import { RendererSettingsController } from "./settings";
import { RendererMode, ShareMode } from "./types";

export interface IPluginRenderer {
    communicator: RendererCommunicator;

    settings: RendererSettingsController;

    rendererMode: RendererMode;
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