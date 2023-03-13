import { TurntableType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ITurntable {
    type: TurntableType;

    location: ILocation;
    rotation: IRotation;

    deckRotation: IRotation;
}