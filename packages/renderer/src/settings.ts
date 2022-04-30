import { RendererSettings, SettingsSchema, Theme } from "@rrox/api";


export interface IBaseRendererSettings {
    'player-name'?: string;
    'theme': Theme
}

const schema: SettingsSchema<IBaseRendererSettings> = {
    'player-name': {
        type: 'string',
    },
    'theme': {
        type   : 'string',
        enum   : Object.values( Theme ),
        default: 'light',
    }
};

export const BaseRendererSettings = RendererSettings<IBaseRendererSettings>( PluginInfo, {
    schema
} );