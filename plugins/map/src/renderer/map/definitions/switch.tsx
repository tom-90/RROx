import { SwitchType } from '@rrox-plugins/world/shared';

export const SwitchDefinitions: { [ key in SwitchType ]: {
    width    : number,
    length   : number,
    direction: number,
} } = {
    [ SwitchType.LEFT         ]: { width: 300, length: 1875, direction: -5.7 },
    [ SwitchType.RIGHT        ]: { width: 300, length: 1875, direction:  5.7 },
    [ SwitchType.Y            ]: { width: 300, length: 1875, direction: -5.7 },
    [ SwitchType.Y_MIRROR     ]: { width: 300, length: 1875, direction:  5.7 },
    [ SwitchType.RIGHT_MIRROR ]: { width: 300, length: 1875, direction:  5.7 },
    [ SwitchType.LEFT_MIRROR  ]: { width: 300, length: 1875, direction: -5.7 },
    [ SwitchType.CROSS        ]: { width: 300, length: 400 , direction:  0 },
};