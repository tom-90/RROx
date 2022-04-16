import { Settings } from "@rrox/api";
import { FrameCarType, FreightFrameCarType, SplineType } from "@rrox/world/shared";

export type FrameCarColors = {
    [ K in FrameCarType as K extends FreightFrameCarType ? `colors.${K}.unloaded` : never ]: string;
} & {
    [ K in FrameCarType as K extends FreightFrameCarType ? `colors.${K}.loaded` : never ]: string;
} & {
    [ K in FrameCarType as K extends FreightFrameCarType ? never : `colors.${K}` ]: string;
};

export type SplineColors = { [ K in SplineType as K extends number ? `colors.spline.${K}` : never ]: string; };

export enum MinimapCorner {
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM_RIGHT = 4,
}

export interface MapSettingsType extends FrameCarColors, SplineColors {
    'map.background': number;

    'minimap.transparent': boolean;
    'minimap.enabled': boolean;
    'minimap.corner': MinimapCorner;

    'features.teleport': boolean;
    'features.controlEngines': boolean;
    'features.controlSwitches': boolean;
    'features.build': boolean;
    'features.cheats': boolean;


    'colors.switch.active'  : string;
    'colors.switch.inactive': string;
    'colors.switch.cross'   : string;
    
    'colors.turntable.circle': string;
    
    'colors.player': string;
}

const schema = {
    'map.background': {
        type: 'number' as const,
        default: 6,
        maximum: 7,
        minimum: 1,
    },

    'minimap.enabled': {
        type: 'boolean' as const,
        default: true
    },
    'minimap.transparent': {
        type: 'boolean' as const,
        default: true
    },
    'minimap.corner': {
        type: 'number' as const,
        default: MinimapCorner.TOP_RIGHT,
        enum: Object.values( MinimapCorner )
    },
    
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

    [ `colors.${FrameCarType.HANDCAR}`         as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.PORTER}`          as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.PORTER2}`         as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.EUREKA}`          as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.EUREKA_TENDER}`   as const ]: { type: 'string', default: '#000000' },
    [ `colors.${FrameCarType.CLIMAX}`          as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.HEISLER}`         as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.CLASS70}`         as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.CLASS70_TENDER}`  as const ]: { type: 'string', default: '#000000' },
    [ `colors.${FrameCarType.COOKE260}`        as const ]: { type: 'string', default: '#800080' },
    [ `colors.${FrameCarType.COOKE260_TENDER}` as const ]: { type: 'string', default: '#000000' },

    [ `colors.${FrameCarType.FLATCAR_LOGS}.unloaded`     as const ]: { type: 'string', default: '#cd5c5c' },
    [ `colors.${FrameCarType.FLATCAR_LOGS}.loaded`       as const ]: { type: 'string', default: '#cd5c5c' },
    [ `colors.${FrameCarType.FLATCAR_CORDWOOD}.unloaded` as const ]: { type: 'string', default: '#ffa500' },
    [ `colors.${FrameCarType.FLATCAR_CORDWOOD}.loaded`   as const ]: { type: 'string', default: '#ffa500' },
    [ `colors.${FrameCarType.FLATCAR_STAKES}.unloaded`   as const ]: { type: 'string', default: '#adff2f' },
    [ `colors.${FrameCarType.FLATCAR_STAKES}.loaded`     as const ]: { type: 'string', default: '#adff2f' },
    [ `colors.${FrameCarType.HOPPER}.unloaded`           as const ]: { type: 'string', default: '#bc8f8f' },
    [ `colors.${FrameCarType.HOPPER}.loaded`             as const ]: { type: 'string', default: '#bc8f8f' },
    [ `colors.${FrameCarType.TANKER}.unloaded`           as const ]: { type: 'string', default: '#d3d3d3' },
    [ `colors.${FrameCarType.TANKER}.loaded`             as const ]: { type: 'string', default: '#d3d3d3' },
    [ `colors.${FrameCarType.BOXCAR}.unloaded`           as const ]: { type: 'string', default: '#808080' },
    [ `colors.${FrameCarType.BOXCAR}.loaded`             as const ]: { type: 'string', default: '#808080' },

    [ `colors.${FrameCarType.CABOOSE}` as const ]: { type: 'string', default: '#ff5e5e' },
    
    [ `colors.spline.${SplineType.TRACK}`         as const ]: { type: 'string', default: '#000000' },
    [ `colors.spline.${SplineType.TRENDLE_TRACK}` as const ]: { type: 'string', default: '#000000' },
    [ `colors.spline.${SplineType.VARIABLE_BANK}` as const ]: { type: 'string', default: '#bdb76b' },
    [ `colors.spline.${SplineType.CONSTANT_BANK}` as const ]: { type: 'string', default: '#bdb76b' },
    [ `colors.spline.${SplineType.VARIABLE_WALL}` as const ]: { type: 'string', default: '#a9a9a9' },
    [ `colors.spline.${SplineType.CONSTANT_WALL}` as const ]: { type: 'string', default: '#a9a9a9' },
    [ `colors.spline.${SplineType.WOODEN_BRIDGE}` as const ]: { type: 'string', default: '#ffa500' },
    [ `colors.spline.${SplineType.IRON_BRIDGE}`   as const ]: { type: 'string', default: '#add8e6' },

    [ `colors.switch.active`   ]: { type: 'string', default: '#000000' },
    [ `colors.switch.inactive` ]: { type: 'string', default: '#ff0000' },
    [ `colors.switch.cross`    ]: { type: 'string', default: '#000000' },
    
    [ `colors.turntable.circle` ]: { type: 'string', default: '#ffffe0' },
    
    [ `colors.player` ]: { type: 'string', default: '#0000ff' },
} as const;

export const MapSettings = Settings<MapSettingsType>( PluginInfo, {
    schema
} );