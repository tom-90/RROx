import { IndustryType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";
import { IStorage } from "./storage";

export interface IIndustry {
    type: IndustryType;
    location: ILocation;
    rotation: IRotation;

    educts: IStorage[];
    products: IStorage[];
}