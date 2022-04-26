import { Settings, SettingsSchema } from "@rrox/api";
import { KeyCodes } from "./keycodes";

export interface IBaseSettings {
    plugins: {
        devFolders: string[]
    },
    overlay: {
        enabled: boolean;
        keybind: KeyCodes[];
    },
    'hardware-acceleration': boolean;
}

const schema: SettingsSchema<IBaseSettings> = {
    plugins: {
        type: 'object',
        properties: {
            devFolders: {
                type: 'array',
                items: {
                    type: 'string'
                },
                default: [],
            }
        },
        default: {}
    },
    overlay: {
        type: 'object',
        properties: {
            enabled: {
                type: 'boolean',
                default: true,
            },
            keybind: {
                type: 'array',
                items: { type: 'number' },
                default: [ KeyCodes.VK_F1 ],
            },
        },
        default: {}
    },
    'hardware-acceleration': {
        type: 'boolean',
        default: true,
    },
};

export const BaseSettings = Settings<IBaseSettings>( PluginInfo, {
    schema
} );