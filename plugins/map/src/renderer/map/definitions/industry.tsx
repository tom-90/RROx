import { IndustryType } from '@rrox-plugins/world/shared';

import LoggingCamp from '../../images/industries/Logging Camp.svg';
import Sawmill from '../../images/industries/Sawmill.svg';
import FreightDepot from '../../images/industries/Freight Depot.svg';
import Smelter from '../../images/industries/Smelter.svg';
import IronMine from '../../images/industries/Iron Mine.svg';
import CoalMine from '../../images/industries/Coal Mine.svg';
import Refinery from '../../images/industries/Refinery.svg';
import Ironworks from '../../images/industries/Ironworks.svg';
import OilField from '../../images/industries/Oil Field.svg';

export type IndustryDefinition = {
    name: string,
    image?: string,
    points: [ [ number, number ], [ number, number ], [ number, number ] ] | [ [ number, number ], [ number, number ] ],
    fillColor?: string,
};

export const IndustryDefinitions: { [ key in IndustryType ]: IndustryDefinition } = {
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
    [ IndustryType.TELEGRAPH_OFFICE ]: {
        name: 'Telegraph Office',
        points: [ [ -150, -200 ], [ 150, 200 ] ],
        fillColor: '#6e0810',
    },
    [ IndustryType.LARGE_ENGINE_SHED_RED ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#ff5959',
    },
    [ IndustryType.LARGE_ENGINE_SHED_BEIGE ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#ffef9c',
    },
    [ IndustryType.LARGE_ENGINE_SHED_BROWN ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#5c4936',
    },
    [ IndustryType.LARGE_ENGINE_SHED_OLD ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#d5e5eb',
    },
    [ IndustryType.COALINGTOWER ]: {
        name: 'Coaling Tower',
        points: [ [ 300, 50 ], [ 900, 650 ] ],
        fillColor: '#5c4936',
    },
    [ IndustryType.WATERTOWER1870_RED ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#ff5959',
    },
    [ IndustryType.WATERTOWER1870_BROWN ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#5c4936',
    },
    [ IndustryType.WATERTOWER1870_BEIGE ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#ffef9c',
    },
    [ IndustryType.WATERTOWER1870_OLD ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#d5e5eb',
    },
    [ IndustryType.KANASKATWATERTOWER_RED ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#ff5959',
    },
    [ IndustryType.KANASKATWATERTOWER_BROWN ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#5c4936',
    },
    [ IndustryType.KANASKATWATERTOWER_BEIGE ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#ffef9c',
    },
    [ IndustryType.KANASKATWATERTOWER_OLD ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#d5e5eb',
    },
};