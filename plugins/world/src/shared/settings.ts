import { Settings } from "@rrox/api";

export interface IWorldSettings {
    'features.teleport': boolean;
    'features.controlEngines': boolean;
    'features.controlSwitches': boolean;
    'features.build': boolean;
    'features.cheats': boolean;
}

const schema = {
    'features.teleport': {
        type: 'boolean' as const,
        default: true
    },

    'features.controlEngines': {
        type: 'boolean' as const,
        default: true
    },

    'features.controlSwitches': {
        type: 'boolean' as const,
        default: true
    },

    'features.build': {
        type: 'boolean' as const,
        default: true
    },

    'features.cheats': {
        type: 'boolean' as const,
        default: true
    },
};

export const WorldSettings = Settings<IWorldSettings>( PluginInfo, {
    schema
} );