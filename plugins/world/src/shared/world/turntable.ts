import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ITurntable {
    location: ILocation;
    rotation: IRotation;

    deckRotation: IRotation;
}