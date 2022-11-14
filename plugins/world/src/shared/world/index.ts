import { IFrameCar } from "./frameCar";
import { IIndustry } from "./industry";
import { IPlayer } from "./player";
import { ISandhouse } from "./sandhouse";
import { ISpline, ISplineTrack } from "./spline";
import { ISwitch } from "./switch";
import { ITurntable } from "./turntable";
import { IWatertower } from "./watertower";

export interface IWorld {
    players: IPlayer[];
    frameCars: IFrameCar[];
    switches: ISwitch[];
    turntables: ITurntable[];
    watertowers: IWatertower[];
    sandhouses: ISandhouse[];
    industries: IIndustry[];
    splines: ISpline[];
    splineTracks: ISplineTrack[];
}

export * from './enums';
export * from './frameCar';
export * from './industry';
export * from './location';
export * from './player';
export * from './rotation';
export * from './sandhouse';
export * from './spline';
export * from './storage';
export * from './switch';
export * from './turntable';
export * from './watertower';