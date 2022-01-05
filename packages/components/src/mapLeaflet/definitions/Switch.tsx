import { SwitchType } from '@rrox/types';

export const SwitchDefinitions: { [ key in SwitchType ]: {
    width    : number,
    length   : number,
    direction: number,
} } = {
    [ SwitchType.LEFT         ]: { width: 300, length: 1900, direction: -6 },
    [ SwitchType.RIGHT        ]: { width: 300, length: 1900, direction:  6 },
    [ SwitchType.Y            ]: { width: 300, length: 1900, direction: -6 },
    [ SwitchType.Y_MIRROR     ]: { width: 300, length: 1900, direction:  6 },
    [ SwitchType.RIGHT_MIRROR ]: { width: 300, length: 1900, direction:  6 },
    [ SwitchType.LEFT_MIRROR  ]: { width: 300, length: 1900, direction: -6 },
    [ SwitchType.CROSS        ]: { width: 300, length: 400 , direction:  0 },
};