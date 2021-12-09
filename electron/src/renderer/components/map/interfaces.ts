import { Frame, Spline, Switch, Turntable, Player, WaterTower, Industry } from '../../../shared/data';

export interface MapData {
    Frames: Frame[];
    Splines: Spline[];
    Switches: Switch[];
    Turntables: Turntable[];
    Players: Player[];
    WaterTowers: WaterTower[];
    Industries: Industry[];
}

export interface MapProperties {
    imageWidth: number;

    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    x: number;
    y: number;

    scale: number;
    imx: number;
    imy: number;
}