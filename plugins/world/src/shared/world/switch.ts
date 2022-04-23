import { SwitchType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ISwitch {
    type: SwitchType;
    state: number;

    location: ILocation;
    rotation: IRotation;
}