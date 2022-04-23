import { ILocation } from "./location";
import { IRotation } from "./rotation";
import { IStorage } from "./storage";

export interface IWatertower {
    location: ILocation;
    rotation: IRotation;
    waterStorage: IStorage;
}