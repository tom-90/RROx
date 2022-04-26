import { Settings, SettingsSchema } from "@rrox/api";

export interface IAutosaveSettings {
    autosave: {
        enabled: boolean;
        slots: string[];
        lastSlot: string;
        interval: number;
    }
}

const schema: SettingsSchema<IAutosaveSettings> = {
    autosave: {
        type: 'object',
        properties: {
            enabled: {
                type: 'boolean',
                default: false,
            },
            slots: {
                type: 'array' as const,
                items: {
                    type: 'string',
                    enum: [ "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9", "slot10", "backup1", "backup2", "backup3" ],
                },
                default: [],
            },
            lastSlot: {
                type: 'string'
            },
            interval: {
                type   : 'number',
                default: 60,
                minimum: 1,
                maximum: 3600
            },
        },
        default: {}
    },
};

export const AutosaveSettings = Settings<IAutosaveSettings>( PluginInfo, {
    schema
} );