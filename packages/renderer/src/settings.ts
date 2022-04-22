import { RendererSettings } from "@rrox/api";

const schema = {
    'player-name': {
        type: 'string' as const,
    },
} as const;

export interface IBaseRendererSettings {
    'player-name': string;
}

export const BaseRendererSettings = RendererSettings<IBaseRendererSettings>( PluginInfo, {
    schema
} );