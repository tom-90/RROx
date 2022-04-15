import { ILocation } from "./location";
import { IRotation } from "./rotation";
import { IStorage } from "./storage";

export interface IIndustry {
    type: number;
    location: ILocation;
    rotation: IRotation;

    educts: IStorage[];
    products: IStorage[];
}