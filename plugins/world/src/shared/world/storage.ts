import { ProductType } from "./enums";
import { ICrane } from "./crane";
import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface IStorage {
    type: ProductType;
    currentAmount: number;
    maxAmount: number;
    cranes: ICrane[];
    location: ILocation;
    rotation: IRotation;
}