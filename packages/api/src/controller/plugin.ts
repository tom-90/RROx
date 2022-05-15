import { IPluginController } from "./controller";

/**
 * When declaring your plugin, you should extend this class.
 * Within this class, you need to define all methods required by RROx.
 */
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