import { Schema } from "electron-store";
import Conf from "conf";
import { Object, Function, String, Any, List } from "ts-toolbelt";

export type SettingsSchema<T> = Schema<T>;

// For migrations, either the RROx settingsstore can be provided (for renderer settings)
// or the electron-store store can be provided (for controller settings)
export type MigrationsSettingsStore<T extends object> = Conf<T> | SettingsStore<T>;

export interface SettingsConfig<T extends object> {
    schema: SettingsSchema<T>;
    migrations?: Record<string, ( store: MigrationsSettingsStore<T> ) => void>,
}

export enum SettingsMode {
    CONTROLLER,
    RENDERER
}

export interface SettingsType<T extends object> {
    module: PluginInfo;
    config: SettingsConfig<T>;
    mode: SettingsMode;

    // Non-existent property to store config object type
    readonly _type: T;
}

export type SettingsKey<T extends object, K extends string> = string extends K ? string : Function.AutoPath<T, K>;
export type SettingsKeyValue<T extends object, K extends string> = string extends K ? unknown : Object.Path<T, String.Split<K, '.'>>;

export type SettingsPath = List.List<Any.Key>;
export type SettingsPathValue<T extends object, P extends SettingsPath> = Object.Path<T, P>;

export interface SettingsStore<T extends object> {
    /**
     * Retrieve a value from the store
     * @param key Key pointing to the value
     */
    get<K extends string, V extends SettingsKeyValue<T, K>>( key: SettingsKey<T, K> ): V;

    /**
     * Retrieve a value from the store
     * @param key Key pointing to the value
     * @param defaultValue Value to return if the key does not exist
     */
    get<K extends string, V extends SettingsKeyValue<T, K>>( path: SettingsKey<T, K>, defaultValue?: SettingsKeyValue<T, K> ): V;

    /**
     * Retrieve all items from the store
     */
    getAll(): T;

    /**
     * Set value in the settings store
     * @param key Key pointing to the value
     * @param value Value to set
     */
    set<K extends string, V extends SettingsKeyValue<T, K>>( path: SettingsKey<T, K>, value: V ): void;

    // These properties are disabled for now as they yield terrible performance
    
    /**
     * Retrieve a value from the store
     * @param path Path to the value
     */
    //get<P extends SettingsPath, V extends SettingsPathValue<T, P>>( path: P ): V;
    
    /**
     * Retrieve a value from the store
     * @param path Path to the value
     * @param defaultValue Value to return if the key does not exist
     */
    //get<P extends SettingsPath, V extends SettingsPathValue<T, P>>( path: P, defaultValue?: SettingsPathValue<T, P> ): V;

    /**
     * Set value in the settings store
     * @param path Path of the key to set
     * @param value Value to set
     */
    //set<P extends SettingsPath, V extends SettingsPathValue<T, P>>( path: P, value: V ): void;

    /**
     * Set multiple keys at once in the setting store
     * 
     * @param values Values to set
     */
    setAll( values: Partial<T> ): void;

    /**
     * Checks if an item exists in the store
     * @param key Key pointing to the value
     */
    has<K extends string>( key: SettingsKey<T, K> ): boolean;
    
    /**
     * Checks if an item exists in the store
     * @param path Path to the value
     */
    has<P extends SettingsPath>( path: P ): boolean;

    /**
     * Reset values to their defaults, as defined in the schema.
     * Use `clear()` to reset all items.
     * 
     * @param keys 
     */
    reset( ...keys: ( string | SettingsPath )[] ): void;

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
export function Settings<T extends object>( plugin: PluginInfo, config: SettingsConfig<T> ): SettingsType<T> {
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
export function RendererSettings<T extends object>( plugin: PluginInfo, config: SettingsConfig<T> ): SettingsType<T> {
    return {
        module: plugin,
        config,
        mode: SettingsMode.RENDERER,
    } as SettingsType<T>;
}