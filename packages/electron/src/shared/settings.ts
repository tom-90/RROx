import { Settings } from "@rrox/api";

export interface IBaseSettings {
    'plugins.devFolders': string[];
}

const schema = {
    'plugins.devFolders': {
        type: 'array',
        items: {
            type: 'string'
        },
        default: [],
    },
} as const;

export const BaseSettings = Settings<IBaseSettings>( PluginInfo, {
    schema
} );