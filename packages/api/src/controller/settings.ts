import { SettingsStore, SettingsType } from "../shared";

export interface SettingsManager {
    /**
     * Initialize settings schema
     *
     * @param settings Settings schema to initialize
     */
    init<T>( settings: SettingsType<T> ): SettingsStore<T>;
}