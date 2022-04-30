import { SettingsStore, SettingsType } from "../shared";

export interface RendererSettingsController {
    /**
     * Get the settings store for a specific settings object
     * 
     * @param settings Settings type
     */
    get<T extends object>( settings: SettingsType<T> ): SettingsStore<T>;
}