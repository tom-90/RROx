import { IPluginController } from "./controller";

export abstract class Controller {
    /**
     * This method will be called when the plugin should be loaded.
     */
    public abstract load( controller: IPluginController ): void | Promise<void>;

    /**
     * This method will be called when the plugin should be unloaded.
     */
    public abstract unload( controller: IPluginController ): void | Promise<void>;
}