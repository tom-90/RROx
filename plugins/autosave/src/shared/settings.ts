import { Settings } from "@rrox/api";

export interface IAutosaveSettings {
    'autosave.enabled': boolean;
    'autosave.slots': string[];
    'autosave.lastSlot': string;
    'autosave.interval': number;
}

const schema = {
    'autosave.enabled': {
        type: 'boolean' as const,
        default: false
    },

    'autosave.slots': {
        type: 'array' as const,
        items: {
            type: 'string' as const,
            enum: [ "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9", "slot10", "backup1", "backup2", "backup3" ],
        },
        default: [] as const,
    },

    'autosave.lastSlot': {
        type: 'string' as const
    },

    'autosave.interval': {
        type   : 'number' as const,
        default: 60,
        minimum: 1,
        maximum: 3600
    },
};

export const AutosaveSettings = Settings<IAutosaveSettings>( PluginInfo, {
    schema
} );