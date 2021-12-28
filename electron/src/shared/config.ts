import { Cars } from './cars';

export const schema = {
    'map.background': {
        type: 'number' as const,
        default: 1,
        maximum: 5,
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
        default: 2,
        minimum: 1,
        maximum: 4
    },
    'autosave.enabled': {
        type: 'boolean' as const,
        default: false
    },
    'autosave.slots': {
        type: 'array' as const,
        items: {
            type: 'number' as const,
            default: 10,
            maximum: 10,
            minimum: 1,
        },
        default: [] as const,
    },
    'autosave.lastSlot': {
        type: 'number' as const,
        maximum: 10,
        minimum: 1,
    },
    'autosave.interval': {
        type   : 'number' as const,
        default: 60,
        minimum: 1,
        maximum: 3600
    },
    'minizwerg.enabled': {
        type: 'boolean' as const,
        default: false
    },
    'minizwerg.public': {
        type: 'boolean' as const,
        default: false
    },
    'minizwerg.url': {
        type: 'string' as const,
    },
    'loglevel': {
        type: 'string' as const,
        default: 'info',
        enum: [ 'error', 'warn', 'info', 'verbose', 'debug', 'silly' ]
    },

    [ `colors.${Cars.FLATCAR_LOGS}.unloaded`     ]: { type: 'string', default: '#cd5c5c' },
    [ `colors.${Cars.FLATCAR_LOGS}.loaded`       ]: { type: 'string', default: '#cd5c5c' },
    [ `colors.${Cars.FLATCAR_CORDWOOD}.unloaded` ]: { type: 'string', default: '#ffa500' },
    [ `colors.${Cars.FLATCAR_CORDWOOD}.loaded`   ]: { type: 'string', default: '#ffa500' },
    [ `colors.${Cars.FLATCAR_STAKES}.unloaded`   ]: { type: 'string', default: '#adff2f' },
    [ `colors.${Cars.FLATCAR_STAKES}.loaded`     ]: { type: 'string', default: '#adff2f' },
    [ `colors.${Cars.HOPPER}.unloaded`           ]: { type: 'string', default: '#bc8f8f' },
    [ `colors.${Cars.HOPPER}.loaded`             ]: { type: 'string', default: '#bc8f8f' },
    [ `colors.${Cars.TANKER}.unloaded`           ]: { type: 'string', default: '#d3d3d3' },
    [ `colors.${Cars.TANKER}.loaded`             ]: { type: 'string', default: '#d3d3d3' },
    [ `colors.${Cars.BOXCAR}.unloaded`           ]: { type: 'string', default: '#808080' },
    [ `colors.${Cars.BOXCAR}.loaded`             ]: { type: 'string', default: '#808080' },
    [ `colors.${Cars.CABOOSE}.unloaded`          ]: { type: 'string', default: '#ff5e5e' },
    [ `colors.${Cars.CABOOSE}.loaded`            ]: { type: 'string', default: '#ff5e5e' },
};

export const accessPropertiesByDotNotation = false;

export interface Schema {
    'map.background': number;
    'minimap.enabled': boolean;
    'minimap.transparent': boolean;
    'minimap.corner': number;
    'autosave.enabled': boolean;
    'autosave.slots': number[];
    'autosave.lastSlot': number;
    'autosave.interval': number;
    'minizwerg.enabled': boolean;
    'minizwerg.public': boolean;
    'minizwerg.url'?: string;
    'loglevel': 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}