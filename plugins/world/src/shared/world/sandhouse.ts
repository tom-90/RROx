import { ILocation } from "./location";
import { IRotation } from "./rotation";
import { IStorage } from "./storage";

export interface ISandhouse {
    location: ILocation;
    rotation: IRotation;
    sandStorage: IStorage;
}