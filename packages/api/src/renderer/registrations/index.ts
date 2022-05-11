import { EventEmitter } from "events";

export interface RegistrationType<ParameterFunction extends ( ...params: any[] ) => void> {
    module: string;
    key: string;

    // Non-existent property to store type
    readonly _pType: ParameterFunction;
}

export type RegistrationParameters<R extends RegistrationType<( ...params: any[] ) => void>> = Parameters<R[ '_pType' ]>;

export interface Registration<R extends RegistrationType<( ...params: any[] ) => void>> {
    parameters: RegistrationParameters<R>;
    metadata  : RegistrationMetadata;

    /**
     * Set the priority for this registration.
     * The priority will determine the order in which the registrations will be processed.
     * A higher priority means that the registration will be processed sooner.
     * 
     * @param priority default = 100
     */
    setPriority: ( priority?: number ) => void;
}

export interface RegistrationMetadata {
    /**
     * Name of the plugin that made the registration.
     */
    readonly plugin: string;

    /**
     * Version of the plugin that made the registration.
     */
    readonly version: string;

    /**
     * Priority of the registration that determined the order of the registration array.
     */
    readonly priority: number;
}

export interface IRegistrationController<R extends RegistrationType<( ...params: any[] ) => void>> extends EventEmitter {
    /**
     * Event that will be triggered when a new registration is made.
     *
     * @param event 
     * @param listener 
     */
    on( event: 'register', listener: ( registration: Registration<R> ) => void ): this;

    /**
     * Event that will be triggered when a registration is unregistered.
     *
     * @param event 
     * @param listener 
     */
    on( event: 'unregister', listener: ( registration: Registration<R> ) => void ): this;

    /**
     * Event that will be triggered when the list of registrations changes without registrations or deregistrations.
     * This will happen for example when the priority of a registration is updated and the list order is changed.
     *
     * @param event 
     * @param listener 
     */
    on( event: 'update', listener: () => void ): this;

    getRegistrations(): Registration<R>[];
}

export function Registration<ParameterFunction extends ( ...params: any[] ) => void>( module: string | PluginInfo, key: string ): RegistrationType<ParameterFunction> {
    return {
        module: typeof module === 'string' ? module : module.name,
        key,
    } as RegistrationType<ParameterFunction>;
}

export * from './context';
export * from './menu';
export * from './overlay';
export * from './route';
export * from './settings';