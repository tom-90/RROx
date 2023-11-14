export enum IndustryType {
    UNKNOWN = 0,
    LOGGING_CAMP = 1,
    SAWMILL = 2,
    SMELTER = 3,
    IRONWORKS = 4,
    OILFIELD = 5,
    REFINERY = 6,
    COALMINE = 7,
    IRONMINE = 8,
    FREIGHT_DEPOT = 9,
    FIREWOOD_DEPOT = 10,
    ENGINE_SHED_BLUE = 11,
    ENGINE_SHED_GOLD = 12,
    ENGINE_SHED_RED = 13,
    ENGINE_SHED_BROWN = 14,
	COALINGTOWER = 15,
    TELEGRAPH_OFFICE = 16,
	KANASKATWATERTOWER_RED = 20,
	KANASKATWATERTOWER_BROWN = 21,
	KANASKATWATERTOWER_BEIGE = 22,
	KANASKATWATERTOWER_OLD = 23,
	WATERTOWER1870_RED = 30,
	WATERTOWER1870_BROWN = 31,
	WATERTOWER1870_BEIGE = 32,
	WATERTOWER1870_OLD = 33,
	DRGWATERTOWER = 34,
	LARGE_ENGINE_SHED_RED = 40,
	LARGE_ENGINE_SHED_BROWN = 41,
	LARGE_ENGINE_SHED_BEIGE = 42,
	LARGE_ENGINE_SHED_OLD = 43,
	WOOD_RICK = 44,

    // The values below do not exist in the game. The numeric industry types were replaced with strings.
    // We keep using numeric types in RROx for backwards compatability
    WHEAT_FARM = 101,
    WATERTOWER_SMALL = 102,
}

export function industryNameToIndustryType(name: string): IndustryType {
    switch(name) {
        case 'logcamp':
            return IndustryType.LOGGING_CAMP;
        case 'sawmill':
            return IndustryType.SAWMILL;
        case 'smelter':
            return IndustryType.SMELTER;
        case 'ironworks':
            return IndustryType.IRONWORKS;
        case 'oilfield':
            return IndustryType.OILFIELD;
        case 'Refinery':
            return IndustryType.REFINERY;
        case 'coalmine':
            return IndustryType.COALMINE;
        case 'ironoremine':
            return IndustryType.IRONMINE;
        case 'freightdepot':
            return IndustryType.FREIGHT_DEPOT;
        case 'firewooddepot':
            return IndustryType.FIREWOOD_DEPOT;
        case 'enginehouse_alpine':
            return IndustryType.ENGINE_SHED_BLUE;
        case 'enginehouse_aspen':
            return IndustryType.ENGINE_SHED_GOLD;
        case 'enginehouse_barn':
            return IndustryType.ENGINE_SHED_RED;
        case 'enginehouse_princess':
            return IndustryType.ENGINE_SHED_BROWN;
        case 'coaltower':
            return IndustryType.COALINGTOWER;
        case 'telegraphoffice':
            return IndustryType.TELEGRAPH_OFFICE;
        case 'watertower_kanaskat_style1':
            return IndustryType.KANASKATWATERTOWER_RED;
        case 'watertower_kanaskat_style2':
            return IndustryType.KANASKATWATERTOWER_BROWN;
        case 'watertower_kanaskat_style3':
            return IndustryType.KANASKATWATERTOWER_BEIGE;
        case 'watertower_kanaskat_style4':
            return IndustryType.KANASKATWATERTOWER_OLD;
        case 'watertower_1870_style1': // Unknown
            return IndustryType.WATERTOWER1870_RED;
        case 'watertower_1870_style2': // Unknown
            return IndustryType.WATERTOWER1870_BROWN;
        case 'watertower_1870_style3': // Unknown
            return IndustryType.WATERTOWER1870_BEIGE;
        case 'watertower_1870_style4': // Unknown
            return IndustryType.WATERTOWER1870_OLD;
        case 'watertower_drwg':
            return IndustryType.DRGWATERTOWER;
        case 'engineshed_style1':
            return IndustryType.LARGE_ENGINE_SHED_RED;
        case 'engineshed_style2':
            return IndustryType.LARGE_ENGINE_SHED_BROWN;
        case 'engineshed_style3':
            return IndustryType.LARGE_ENGINE_SHED_BEIGE;
        case 'engineshed_style4':
            return IndustryType.LARGE_ENGINE_SHED_OLD;
        case 'Woodrick':
            return IndustryType.WOOD_RICK;
        case 'WheatFarm':
            return IndustryType.WHEAT_FARM;
        case 'watertower_small':
            return IndustryType.WATERTOWER_SMALL;
        default:
            console.log('Unknown industry name', name);
            return IndustryType.UNKNOWN;
    }
}