import { SplineType } from "./enums";
import { ILocation } from "./location";

export interface ISpline {
    type: SplineType;
    location: ILocation;
    segments: ISplineSegment[];
}

export interface ISplineSegment {
    start: ILocation;
    end: ILocation;
    visible: boolean;
}