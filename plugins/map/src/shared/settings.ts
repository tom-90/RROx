import { RendererSettings, SettingsSchema } from "@rrox/api";
import { FrameCarType, FreightFrameCarType, SplineType } from "@rrox-plugins/world/shared";

export type SplineColors = { [ K in SplineType ]: string; };

export type FrameCarColors = {
    [ K in FrameCarType ]: K extends FreightFrameCarType ? {
        unloaded: string;
        loaded: string
    } : string;
}

export enum MinimapCorner {
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM_RIGHT = 4,
}

export interface IMapPreferences {
    map: {
        background: number,
    },
    minimap: {
        transparent: boolean,
        enabled: boolean,
        corner: MinimapCorner,
    },
    colors: {
        switch: {
            active: string,
            inactive: string,
            cross: string,
        },
        turntable: {
            circle: string,
        },
        player: string,
        spline: SplineColors,
    } & FrameCarColors,
}

const preferencesSchema: SettingsSchema<IMapPreferences> = {
    map: {
        type: 'object',
        properties: {
            background: {
                type: 'number',
                default: 6,
                maximum: 7,
                minimum: 1,
            },
        },
        default: {}
    },
    minimap: {
        type: 'object',
        properties: {
            enabled: {
                type: 'boolean',
                default: true
            },
            transparent: {
                type: 'boolean',
                default: true
            },
            corner: {
                type: 'number',
                default: MinimapCorner.TOP_RIGHT,
                enum: Object.values( MinimapCorner )
            },
        },
        default: {}
    },

    colors: {
        type: 'object',
        properties: {
            [ FrameCarType.HANDCAR         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.PORTER          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.PORTER2         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.EUREKA          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.EUREKA_TENDER   ]: { type: 'string', default: '#000000' },
            [ FrameCarType.CLIMAX          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.HEISLER         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.CLASS70         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.CLASS70_TENDER  ]: { type: 'string', default: '#000000' },
            [ FrameCarType.COOKE260        ]: { type: 'string', default: '#800080' },
            [ FrameCarType.COOKE260_TENDER ]: { type: 'string', default: '#000000' },
            [ FrameCarType.CABOOSE         ]: { type: 'string', default: '#ff5e5e' },
			[ FrameCarType.WAYCAR          ]: { type: 'string', default: '#ff5e5e' },
			[ FrameCarType.MONTEZUMA          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.MONTEZUMA_TENDER   ]: { type: 'string', default: '#000000' },

            [ FrameCarType.FLATCAR_LOGS ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#cd5c5c' },
                    loaded: { type: 'string', default: '#cd5c5c' },
                },
                default: {}
            },
            [ FrameCarType.FLATCAR_CORDWOOD ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#ffa500' },
                    loaded: { type: 'string', default: '#ffa500' },
                },
                default: {}
            },
            [ FrameCarType.FLATCAR_STAKES ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#adff2f' },
                    loaded: { type: 'string', default: '#adff2f' },
                },
                default: {}
            },
            [ FrameCarType.HOPPER ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#bc8f8f' },
                    loaded: { type: 'string', default: '#bc8f8f' },
                },
                default: {}
            },
            [ FrameCarType.TANKER ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#d3d3d3' },
                    loaded: { type: 'string', default: '#d3d3d3' },
                },
                default: {}
            },
            [ FrameCarType.BOXCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#808080' },
                    loaded: { type: 'string', default: '#808080' },
                },
                default: {}
            },

            spline: {
                type: 'object',
                properties: {
                    [ SplineType.TRACK         ]: { type: 'string', default: '#000000' },
                    [ SplineType.TRENDLE_TRACK ]: { type: 'string', default: '#000000' },
                    [ SplineType.VARIABLE_BANK ]: { type: 'string', default: '#bdb76b' },
                    [ SplineType.CONSTANT_BANK ]: { type: 'string', default: '#bdb76b' },
                    [ SplineType.VARIABLE_WALL ]: { type: 'string', default: '#a9a9a9' },
                    [ SplineType.CONSTANT_WALL ]: { type: 'string', default: '#a9a9a9' },
                    [ SplineType.WOODEN_BRIDGE ]: { type: 'string', default: '#ffa500' },
                    [ SplineType.IRON_BRIDGE   ]: { type: 'string', default: '#add8e6' },
                },
                default: {}
            },

            switch: {
                type: 'object',
                properties: {
                    active  : { type: 'string', default: '#000000' },
                    inactive: { type: 'string', default: '#ff0000' },
                    cross   : { type: 'string', default: '#000000' },
                },
                default: {}
            },

            turntable: {
                type: 'object',
                properties: {
                    circle  : { type: 'string', default: '#ffffe0' },
                },
                default: {}
            },

            player: { type: 'string', default: '#0000ff' }
        },
        default: {}
    }
} as const;

export const MapPreferences = RendererSettings<IMapPreferences>( PluginInfo, {
    schema: preferencesSchema
} );