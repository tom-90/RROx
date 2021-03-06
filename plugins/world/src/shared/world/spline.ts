import { SplineType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface ISpline {
    type: SplineType;
    location: ILocation;
    rotation: IRotation;
    segments: ISplineSegment[];
}

export interface ISplineSegment {
    start: ILocation;
    end: ILocation;
    visible: boolean;
}