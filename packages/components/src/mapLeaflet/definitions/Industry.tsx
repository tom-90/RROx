import { IndustryType } from '@rrox/types';

import LoggingCamp from '@rrox/assets/images/industries/Logging Camp.svg';
import Sawmill from '@rrox/assets/images/industries/Sawmill.svg';
import FreightDepot from '@rrox/assets/images/industries/Freight Depot.svg';
import Smelter from '@rrox/assets/images/industries/Smelter.svg';
import IronMine from '@rrox/assets/images/industries/Iron Mine.svg';
import CoalMine from '@rrox/assets/images/industries/Coal Mine.svg';
import Refinery from '@rrox/assets/images/industries/Refinery.svg';
import Ironworks from '@rrox/assets/images/industries/Ironworks.svg';
import OilField from '@rrox/assets/images/industries/Oil Field.svg';

export const IndustryDefinitions: { [ key in IndustryType ]: {
    name: string,
    image?: string,
    points: [ [ number, number ], [ number, number ], [ number, number ] ] | [ [ number, number ], [ number, number ] ],
    fillColor?: string,
} } = {
    [ IndustryType.LOGGING_CAMP ]: {
        name: 'Logging Camp',
        image: LoggingCamp,
        points: [ [ -2700, -4800 ], [ 6800, -4700 ], [ -2500, 4300 ] ]
    },
    [ IndustryType.SAWMILL ]: {
        name: 'Sawmill',
        image: Sawmill,
        points: [ [ -5600, -5000 ], [ 5600, -5600 ], [ -5600, 6500 ] ],
    },
    [ IndustryType.FREIGHT_DEPOT ]: {
        name: 'Freight Depot',
        image: FreightDepot,
        points: [ [ 5000, -4800 ], [ 5000, 5200 ], [ -5000, -4800 ] ],
    },
    [ IndustryType.SMELTER ]: {
        name: 'Smelter',
        image: Smelter,
        points: [ [ 4000, 2500 ], [ -3800, 2500 ], [ 4000, -5300 ] ],
    },
    [ IndustryType.IRONMINE ]: {
        name: 'Iron Mine',
        image: IronMine,
        points: [ [ 4200, -2200 ], [ 4500, 4200 ], [ -2800, -1100 ] ],
    },
    [ IndustryType.COALMINE ]: {
        name: 'Coal Mine',
        image: CoalMine,
        points: [ [ 4600, -3700 ], [ 4600, 2500 ], [ -1100, -3700 ] ],
    },
    [ IndustryType.REFINERY ]: {
        name: 'Refinery',
        image: Refinery,
        points: [ [ -5200, 6600 ], [ -5200, -3500 ], [ 5000, 6200 ] ],
    },
    [ IndustryType.IRONWORKS ]: {
        name: 'Ironworks',
        image: Ironworks,
        points: [ [ 4000, 3300 ], [ -4600, 3300 ], [ 4000, -5200 ] ],
    },
    [ IndustryType.OILFIELD ]: {
        name: 'Oil field',
        image: OilField,
        points: [ [ 11000, 9500 ], [ -6700, 9500 ], [ 11000, -7900 ] ],
    },
    [ IndustryType.FIREWOOD_DEPOT ]: {
        name: 'Firewood Depot',
        points: [ [ -900, 100 ], [ 1000, 1200 ] ],
        fillColor: 'orange',
    },
    [ IndustryType.ENGINE_SHED_BLUE ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#4f6cff',
    },
    [ IndustryType.ENGINE_SHED_BROWN ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#5c4936',
    },
    [ IndustryType.ENGINE_SHED_GOLD ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#ffef9c',
    },
    [ IndustryType.ENGINE_SHED_RED ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#ff5959',
    },
};