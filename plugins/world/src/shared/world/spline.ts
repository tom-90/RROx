import { SplineTrackType, SplineType } from "./enums";
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

export interface ISplineTrack {
    type: SplineTrackType;
    location: ILocation;
    locationEnd: ILocation;
    tangentStart: ILocation;
    tangentEnd: ILocation;
    rotation: IRotation;
    switchState: number;
    switchEnd1: ILocation;
    switchEnd2: ILocation;
}