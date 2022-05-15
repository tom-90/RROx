import { SettingsStore, SettingsType } from "../shared";

/**
 * SettingsManager which allows you to initialize a declared settings type.
 */
export interface SettingsManager {
    /**
     * Initialize settings schema.
     * This should be done before the renderer attempts to retrieve the settings.
     *
     * @param settings Settings schema to initialize
     */
    init<T extends object>( settings: SettingsType<T> ): SettingsStore<T>;
}