import { SettingsStore, SettingsType } from "../shared";

/**
 * The settings controller allows you to retrieve the settings store for a declared settings type.
 */
export interface RendererSettingsController {
    /**
     * Get the settings store for a specific settings object
     * 
     * @param settings Settings type
     */
    get<T extends object>( settings: SettingsType<T> ): SettingsStore<T>;
}