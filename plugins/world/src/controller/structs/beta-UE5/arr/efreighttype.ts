import { ProductType } from "../../../../shared";

export enum EFreightType {
    None = 0,
    Lumber = 1,
    Log = 2,
    FireWood = 3,
    CordWood = 4,
    Coal = 5,
    CrudeOil = 6,
    OilBarrel = 7,
    IronOre = 8,
    RawIron = 9,
    Rail = 10,
    Beam = 11,
    Water = 12,
    Sand = 13,
    SteelPipe = 14,
    CrateTools = 15,
    SeedPallet = 16,
    StrawBale = 17,
    Grain = 18,
    EFreightType_MAX = 19,
}

export function freightTypeToProductType(freightType: EFreightType): ProductType | null {
    switch(freightType) {
        case EFreightType.None:
            return null;
        case EFreightType.Lumber:
            return ProductType.LUMBER;
        case EFreightType.Log:
            return ProductType.LOG;
        case EFreightType.FireWood:
            return ProductType.FIREWOOD;
        case EFreightType.CordWood:
            return ProductType.CORDWOOD;
        case EFreightType.Coal:
            return ProductType.COAL;
        case EFreightType.CrudeOil:
            return ProductType.CRUDEOIL;
        case EFreightType.OilBarrel:
            return ProductType.OILBARREL;
        case EFreightType.IronOre:
            return ProductType.IRONORE;
        case EFreightType.RawIron:
            return ProductType.RAWIRON;
        case EFreightType.Rail:
            return ProductType.RAILS;
        case EFreightType.Beam:
            return ProductType.BEAM;
        case EFreightType.Water:
            return ProductType.WATER;
        case EFreightType.Sand:
            return ProductType.SAND;
        case EFreightType.SteelPipe:
            return ProductType.STEELPIPES;
        case EFreightType.CrateTools:
            return ProductType.TOOLS;
        case EFreightType.SeedPallet:
            return ProductType.SEEDPALLET;
        case EFreightType.StrawBale:
            return ProductType.STRAWBALE;
        case EFreightType.Grain:
            return ProductType.GRAIN;
        case EFreightType.EFreightType_MAX:
            return null
    }
}