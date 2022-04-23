import { IPluginRenderer } from "./renderer";

export abstract class Renderer {
    /**
     * This method will be called when the plugin should be loaded.
     */
    public abstract load( renderer: IPluginRenderer ): void | Promise<void>;

    /**
     * This method will be called when the plugin should be unloaded.
     */
    public abstract unload( renderer: IPluginRenderer ): void | Promise<void>;
}

export * from './communicator';
export * from './context';
export * from './utils';
export * from './registrations';
export * from './renderer';
export * from './types';