import { RendererSettings, SettingsSchema } from "@rrox/api";
import { FrameCarType, FreightFrameCarType, SplineType } from "@rrox-plugins/world/shared";

export type SplineColors = { [ K in SplineType ]: string; };

export type FrameCarColors = {
    [ K in FrameCarType ]: K extends FreightFrameCarType ? {
        unloaded: string;
        partiallyloaded: string;
		fullyloaded: string
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
                maximum: 12,
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
            [ FrameCarType.HANDCAR          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.PORTER           ]: { type: 'string', default: '#800080' },
            [ FrameCarType.PORTER2          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.EUREKA           ]: { type: 'string', default: '#800080' },
            [ FrameCarType.EUREKA_TENDER    ]: { type: 'string', default: '#000000' },
            [ FrameCarType.CLIMAX           ]: { type: 'string', default: '#800080' },
            [ FrameCarType.HEISLER          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.CLASS70          ]: { type: 'string', default: '#800080' },
            [ FrameCarType.CLASS70_TENDER   ]: { type: 'string', default: '#000000' },
            [ FrameCarType.COOKE260         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.COOKE260_TENDER  ]: { type: 'string', default: '#000000' },
            [ FrameCarType.MOSCA            ]: { type: 'string', default: '#800080' },
            [ FrameCarType.MOSCA_TENDER     ]: { type: 'string', default: '#000000' },
            [ FrameCarType.CABOOSE          ]: { type: 'string', default: '#ff5e5e' },
			[ FrameCarType.WAYCAR           ]: { type: 'string', default: '#ff5e5e' },
			[ FrameCarType.PLOW             ]: { type: 'string', default: '#f0a330' },
			[ FrameCarType.MONTEZUMA        ]: { type: 'string', default: '#800080' },
            [ FrameCarType.MONTEZUMA_TENDER ]: { type: 'string', default: '#000000' },
			[ FrameCarType.GLENBROOK        ]: { type: 'string', default: '#800080' },
            [ FrameCarType.GLENBROOK_TENDER ]: { type: 'string', default: '#000000' },
			[ FrameCarType.SHAY             ]: { type: 'string', default: '#800080' },
			[ FrameCarType.BALDWIN622D      ]: { type: 'string', default: '#800080' },
			[ FrameCarType.COOKE280         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.COOKE280_TENDER  ]: { type: 'string', default: '#000000' },
			
			[ FrameCarType.TENMILE             ]: { type: 'string', default: '#800080' },
			[ FrameCarType.RUBYBASIN           ]: { type: 'string', default: '#800080' },
			[ FrameCarType.COOKE260COAL        ]: { type: 'string', default: '#800080' },
            [ FrameCarType.COOKE260COAL_TENDER ]: { type: 'string', default: '#000000' },
			[ FrameCarType.TWEETSIE280         ]: { type: 'string', default: '#800080' },
            [ FrameCarType.TWEETSIE280_TENDER  ]: { type: 'string', default: '#000000' },
			[ FrameCarType.LIMA280             ]: { type: 'string', default: '#800080' },
            [ FrameCarType.LIMA280_TENDER      ]: { type: 'string', default: '#000000' },
            [ FrameCarType.FERRIES_242_T       ]: { type: 'string', default: '#800080' },
			
			[ FrameCarType.COACH_DSPRR_2       ]: { type: 'string', default: '#ADD8E6' },
			
			[ FrameCarType.PLANTATIONCAR_FLATCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#6b6b6b' },
                    partiallyloaded: { type: 'string', default: '#6b6b6b' },
					fullyloaded: { type: 'string', default: '#6b6b6b' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_FLATCAR_LOGS ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#cd5c5c' },
                    partiallyloaded: { type: 'string', default: '#cd5c5c' },
					fullyloaded: { type: 'string', default: '#cd5c5c' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_FLATCAR_STAKES ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#adff2f' },
                    partiallyloaded: { type: 'string', default: '#adff2f' },
					fullyloaded: { type: 'string', default: '#adff2f' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_FLATCAR_STAKES_BULKHEAD ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#ffa500' },
                    partiallyloaded: { type: 'string', default: '#ffa500' },
					fullyloaded: { type: 'string', default: '#ffa500' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_HOPPER_SMALL ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#9d7777' },
                    partiallyloaded: { type: 'string', default: '#9d7777' },
					fullyloaded: { type: 'string', default: '#9d7777' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_HOPPER_MEDIUM ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#9d7777' },
                    partiallyloaded: { type: 'string', default: '#9d7777' },
					fullyloaded: { type: 'string', default: '#9d7777' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_HOPPER_LARGE ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#9d7777' },
                    partiallyloaded: { type: 'string', default: '#9d7777' },
					fullyloaded: { type: 'string', default: '#9d7777' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_TANKER ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#d3d3d3' },
                    partiallyloaded: { type: 'string', default: '#d3d3d3' },
					fullyloaded: { type: 'string', default: '#d3d3d3' },
                },
                default: {}
            },
			[ FrameCarType.PLANTATIONCAR_BOXCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#6b6b6b' },
                    partiallyloaded: { type: 'string', default: '#6b6b6b' },
					fullyloaded: { type: 'string', default: '#6b6b6b' },
                },
                default: {}
            },
			[ FrameCarType.SKELETONCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#cd775c' },
                    partiallyloaded: { type: 'string', default: '#cd775c' },
					fullyloaded: { type: 'string', default: '#cd775c' },
                },
                default: {}
            },
            [ FrameCarType.FLATCAR_LOGS ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#cd5c5c' },
                    partiallyloaded: { type: 'string', default: '#cd5c5c' },
					fullyloaded: { type: 'string', default: '#cd5c5c' },
                },
                default: {}
            },
            [ FrameCarType.FLATCAR_CORDWOOD ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#ffa500' },
                    partiallyloaded: { type: 'string', default: '#ffa500' },
					fullyloaded: { type: 'string', default: '#ffa500' },
                },
                default: {}
            },
            [ FrameCarType.FLATCAR_STAKES ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#adff2f' },
                    partiallyloaded: { type: 'string', default: '#adff2f' },
					fullyloaded: { type: 'string', default: '#adff2f' },
                },
                default: {}
            },
            [ FrameCarType.HOPPER ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#bc8f8f' },
                    partiallyloaded: { type: 'string', default: '#bc8f8f' },
					fullyloaded: { type: 'string', default: '#bc8f8f' },
                },
                default: {}
            },
			[ FrameCarType.HOPPERBB ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#9d7777' },
                    partiallyloaded: { type: 'string', default: '#9d7777' },
					fullyloaded: { type: 'string', default: '#9d7777' },
                },
                default: {}
            },
            [ FrameCarType.TANKER ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#d3d3d3' },
                    partiallyloaded: { type: 'string', default: '#d3d3d3' },
					fullyloaded: { type: 'string', default: '#d3d3d3' },
                },
                default: {}
            },
			[ FrameCarType.TANKERNCO ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#c5c5c5' },
                    partiallyloaded: { type: 'string', default: '#c5c5c5' },
					fullyloaded: { type: 'string', default: '#c5c5c5' },
                },
                default: {}
            },
            [ FrameCarType.BOXCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#808080' },
                    partiallyloaded: { type: 'string', default: '#808080' },
					fullyloaded: { type: 'string', default: '#808080' },
                },
                default: {}
            },
			[ FrameCarType.STOCKCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#6b6b6b' },
                    partiallyloaded: { type: 'string', default: '#6b6b6b' },
					fullyloaded: { type: 'string', default: '#6b6b6b' },
                },
                default: {}
            },
			[ FrameCarType.VENTILATED_BOXCAR_CC ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#cd5c5c' },
                    partiallyloaded: { type: 'string', default: '#cd5c5c' },
					fullyloaded: { type: 'string', default: '#cd5c5c' },
                },
                default: {}
            },
			[ FrameCarType.WATERCAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#5b92cd' },
                    partiallyloaded: { type: 'string', default: '#5b92cd' },
					fullyloaded: { type: 'string', default: '#5b92cd' },
                },
                default: {}
            },
			[ FrameCarType.OAHU_WATER_CAR ]: {
                type: 'object',
                properties: {
                    unloaded: { type: 'string', default: '#5a8bbf' },
                    partiallyloaded: { type: 'string', default: '#5a8bbf' },
					fullyloaded: { type: 'string', default: '#5a8bbf' },
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
                    [ SplineType.BUMPER        ]: { type: 'string', default: '#e6020e' },
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