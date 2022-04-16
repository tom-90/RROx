import { SplineType } from '@rrox/world/shared';

export const SplineDefinitions: { [ key in SplineType ]: {
    width : number,
    height: number,
} } = {
    [ SplineType.TRACK         ]: { width: 300 , height: 30 },

    [ SplineType.VARIABLE_BANK ]: { width: 1500, height: 1000 },
    [ SplineType.CONSTANT_BANK ]: { width: 1500, height: 1000 },

    [ SplineType.WOODEN_BRIDGE ]: { width: 1500, height: 1500 },
    [ SplineType.TRENDLE_TRACK ]: { width: 300 , height: 30 },

    [ SplineType.VARIABLE_WALL ]: { width: 1000, height: 1000 },
    [ SplineType.CONSTANT_WALL ]: { width: 1000, height: 1000 },

    [ SplineType.IRON_BRIDGE   ]: { width: 1500, height: 2700 },
};