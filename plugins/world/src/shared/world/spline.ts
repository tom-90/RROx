import { ILocation } from "./location";

export interface ISpline {
    type: number;
    points: ILocation[];
    visibility: boolean[];
}