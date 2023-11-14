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
    productionChainBuilding: boolean,
    fuelingBuilding: boolean,
};

export const IndustryDefinitions: { [ key in IndustryType ]: IndustryDefinition } = {
    [ IndustryType.LOGGING_CAMP ]: {
        name: 'Logging Camp',
        image: LoggingCamp,
        points: [ [ -2700, -4800 ], [ 6800, -4700 ], [ -2500, 4300 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.SAWMILL ]: {
        name: 'Sawmill',
        image: Sawmill,
        points: [ [ -5600, -5000 ], [ 5600, -5600 ], [ -5600, 6500 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.FREIGHT_DEPOT ]: {
        name: 'Freight Depot',
        image: FreightDepot,
        points: [ [ 5000, -4800 ], [ 5000, 5200 ], [ -5000, -4800 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.SMELTER ]: {
        name: 'Smelter',
        image: Smelter,
        points: [ [ 4000, 2500 ], [ -3800, 2500 ], [ 4000, -5300 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.IRONMINE ]: {
        name: 'Iron Mine',
        image: IronMine,
        points: [ [ 4200, -2200 ], [ 4500, 4200 ], [ -2800, -1100 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.COALMINE ]: {
        name: 'Coal Mine',
        image: CoalMine,
        points: [ [ 4600, -3700 ], [ 4600, 2500 ], [ -1100, -3700 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.REFINERY ]: {
        name: 'Refinery',
        image: Refinery,
        points: [ [ -5200, 6600 ], [ -5200, -3500 ], [ 5000, 6200 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.IRONWORKS ]: {
        name: 'Ironworks',
        image: Ironworks,
        points: [ [ 4000, 3300 ], [ -4600, 3300 ], [ 4000, -5200 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.OILFIELD ]: {
        name: 'Oil field',
        image: OilField,
        points: [ [ 11000, 9500 ], [ -6700, 9500 ], [ 11000, -7900 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.FIREWOOD_DEPOT ]: {
        name: 'Firewood Depot',
        points: [ [ -900, 100 ], [ 1000, 1200 ] ],
        fillColor: 'orange',
        productionChainBuilding: false,
        fuelingBuilding: true,
    },
    [ IndustryType.ENGINE_SHED_BLUE ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#4f6cff',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.ENGINE_SHED_BROWN ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#5c4936',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.ENGINE_SHED_GOLD ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#ffef9c',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.ENGINE_SHED_RED ]: {
        name: 'Engine Shed',
        points: [ [ -500, 0 ], [ 500, 2000 ] ],
        fillColor: '#ff5959',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.TELEGRAPH_OFFICE ]: {
        name: 'Telegraph Office',
        points: [ [ -150, -200 ], [ 150, 200 ] ],
        fillColor: '#6e0810',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.LARGE_ENGINE_SHED_RED ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#ff5959',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.LARGE_ENGINE_SHED_BEIGE ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#ffef9c',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.LARGE_ENGINE_SHED_BROWN ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#5c4936',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.LARGE_ENGINE_SHED_OLD ]: {
        name: 'Engine Shed',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        fillColor: '#d5e5eb',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.COALINGTOWER ]: {
        name: 'Coaling Tower',
        points: [ [ 300, 50 ], [ 900, 650 ] ],
        fillColor: '#5c4936',
        productionChainBuilding: false,
        fuelingBuilding: true,
    },
    [ IndustryType.WATERTOWER1870_RED ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#ff5959',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WATERTOWER1870_BROWN ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#5c4936',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WATERTOWER1870_BEIGE ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#ffef9c',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WATERTOWER1870_OLD ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#d5e5eb',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.KANASKATWATERTOWER_RED ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#ff5959',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.KANASKATWATERTOWER_BROWN ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#5c4936',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.KANASKATWATERTOWER_BEIGE ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#ffef9c',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.KANASKATWATERTOWER_OLD ]: {
        name: 'Water Tower',
        points: [ [ -150, 300 ], [ 150, 700 ] ],
        fillColor: '#d5e5eb',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WOOD_RICK ]: {
        name: 'Wood Rick',
        points: [ [ -100, -150 ], [ 100, 150 ] ],
        fillColor: 'orange',
        productionChainBuilding: false,
        fuelingBuilding: true,
    },
    [ IndustryType.DRGWATERTOWER ]: {
        name: 'Water Tower',
        points: [ [ -400, 100 ], [ 400, 900 ] ],
        fillColor: '#e7e6d2',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WATERTOWER_SMALL ]: {
        name: 'Water Tower',
        points: [ [ -250, 250 ], [ 250, 750 ] ],
        fillColor: '#e7e6d2',
        productionChainBuilding: false,
        fuelingBuilding: false,
    },
    [ IndustryType.WHEAT_FARM ]: {
        name: 'Wheat Farm',
        fillColor: '#666',
        points: [ [ -490, 0 ], [ 490, 2100 ] ],
        productionChainBuilding: true,
        fuelingBuilding: false,
    },
    [ IndustryType.UNKNOWN ]: {
        name: 'Unknown',
        points: [ [ -500, 0 ], [ 500, 500 ] ],
        fillColor: '#666',
        productionChainBuilding: false,
        fuelingBuilding: false,
    }
};