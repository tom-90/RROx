import { Spline, SplineSegment } from "./data";
import { SplineType } from "./spline";

export enum BuildSplineMode {
    PATH = "PATH",
    POINTS = "POINTS"
}

export interface BuildSplinePath {
    type: SplineType;
    mode: BuildSplineMode.PATH;
    path: ( string | [ number, number ] )[]
}

export interface BuildSplineSegment extends SplineSegment {
    PathDistance: number;
}

export interface BuildSplinePoints extends Spline {
    mode      : BuildSplineMode.POINTS;
    HeightData: HeightData[];
    Segments  : BuildSplineSegment[];
}

export type BuildSpline = BuildSplinePath | BuildSplinePoints;

export interface HeightData {
    distance: number;
    heights : {
        type  : SplineType | 'TERRAIN';
        id    : number;
        height: number;
    }[];
}