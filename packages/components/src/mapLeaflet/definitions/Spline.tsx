import { SplineType } from '@rrox/types';

export const SplineDefinitions: { [ key in SplineType ]: {
    width: number
} } = {
    [ SplineType.TRACK         ]: { width: 300  },

    [ SplineType.VARIABLE_BANK ]: { width: 1500 },
    [ SplineType.CONSTANT_BANK ]: { width: 1500 },

    [ SplineType.WOODEN_BRIDGE ]: { width: 1500 },
    [ SplineType.TRENDLE_TRACK ]: { width: 300  },

    [ SplineType.VARIABLE_WALL ]: { width: 1500 },
    [ SplineType.CONSTANT_WALL ]: { width: 1500 },

    [ SplineType.IRON_BRIDGE   ]: { width: 1500 },
};