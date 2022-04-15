import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface IPlayer {
    name: string;
    location: ILocation;
    rotation: IRotation;
}