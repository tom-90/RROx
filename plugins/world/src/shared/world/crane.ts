import { ProductType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ICrane {
   id: number;
   type: ProductType;
   location: ILocation;
   rotation: IRotation;
}