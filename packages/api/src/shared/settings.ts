import { Schema } from "electron-store";
import Conf from "conf";

export type SettingsSchema<T> = Schema<T>;

// For migrations, either the RROx settingsstore can be provided (for renderer settings)
// or the electron-store store can be provided (for controller settings)
export type MigrationsSettingsStore<T> = Conf<T> | SettingsStore<T>;

export interface SettingsConfig<T> {
    schema: SettingsSchema<T>;
    migrations?: Record<string, ( store: MigrationsSettingsStore<T> ) => void>,
}

export enum SettingsMode {
    CONTROLLER,
    RENDERER
}

export interface SettingsType<T> {
    module: PluginInfo;
    config: SettingsConfig<T>;
    mode: SettingsMode;

    // Non-existent property to store config object type
    readonly _type: T;
}

export interface SettingsStore<T> {
    /**
     * Retrieve a value from the store
     * @param key Key of the value
     */
    get<K extends keyof T>( key: K ): T[ K ];

    /**
     * Retrieve a value from the store
     * @param key Key of the value
     * @param defaultValue Value to return if the key does not exist
     */
    get<K extends keyof T>( key: K, defaultValue?: Required<T[ K ]> ): Required<T[ K ]>;


    /**
     * Retrieve all items from the store
     */
    get(): T;

    /**
     * Set value in the settings store
     * @param key Key to set
     * @param value Value to set
     */
    set<K extends keyof T>( key: K, value: T[ K ] ): void;

    /**
     * Set multiple keys at once in the setting store
     * 
     * @param values Values to set
     */
    set( values: Partial<T> ): void;

    /**
     * Checks if an item exists in the store
     * @param key 
     */
    has( key: keyof T ): boolean;

    /**
     * Reset values to their defaults, as defined in the schema.
     * Use `clear()` to reset all items.
     * 
     * @param keys 
     */
    reset( ...keys: ( keyof T )[] ): void;

    /**
     * Reset all values to their defaults.
     */
    clear(): void;

    /**
     * Add an event listener to receive update events for the settings object
     *
     * @param event 
     * @param listener 
     */
    addListener( event: 'update', listener: () => void ): void;

    /**
     * Remove an event listener
     *
     * @param event 
     * @param listener 
     */
    removeListener( event: 'update', listener: () => void ): void;
}

/**
 * Initialize a settings schema that can be used by the plugin.
 * These settings are available in both the renderer and controller, and can be edited by both the renderer and controller.
 * They cannot be edited by a remote renderer.
 * 
 * @param plugin Plugin to initialize settings for. You can use the global `PluginInfo` variable.
 * @param config Options for the config
 */
export function Settings<T>( plugin: PluginInfo, config: SettingsConfig<T> ): SettingsType<T> {
    return {
        module: plugin,
        config,
        mode: SettingsMode.CONTROLLER,
    } as SettingsType<T>;
}

/**
 * Initialize a settings schema that can be used by the renderer.
 * These settings are not available for the controller.
 * Each renderer will have it's own settings object, meaning that a remote renderer will not share the settings with the electron renderer.
 * 
 * @param plugin Plugin to initialize settings for. You can use the global `PluginInfo` variable.
 * @param config Options for the config
 */
export function RendererSettings<T>( plugin: PluginInfo, config: SettingsConfig<T> ): SettingsType<T> {
    return {
        module: plugin,
        config,
        mode: SettingsMode.RENDERER,
    } as SettingsType<T>;
}