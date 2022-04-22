import { Settings } from "@rrox/api";
import { KeyCodes } from "./keycodes";

export interface IBaseSettings {
    'plugins.devFolders': string[];
    'overlay.enabled': boolean;
    'overlay.keybind': number[];
    'hardware-acceleration': boolean;
}

const schema = {
    'plugins.devFolders': {
        type: 'array',
        items: {
            type: 'string'
        },
        default: [],
    },
    'overlay.enabled': {
        type: 'boolean',
        default: true,
    },
    'overlay.keybind': {
        type: 'array' as const,
        items: { type: 'number' as const },
        default: [ KeyCodes.VK_F1 ] as const,
    },
    'hardware-acceleration': {
        type: 'boolean',
        default: true,
    },
} as const;

export const BaseSettings = Settings<IBaseSettings>( PluginInfo, {
    schema
} );