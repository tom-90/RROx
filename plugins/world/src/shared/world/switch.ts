import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ISwitch {
    type: number;
    state: number;

    location: ILocation;
    rotation: IRotation;
}