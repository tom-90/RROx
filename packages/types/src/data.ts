import { Cars } from "./cars";
import { IndustryType } from "./industry";
import { SplineType } from "./spline";
import { SwitchType } from "./switch";

export interface Frame {
    ID: number;
    Type: Cars;
    Name: string;
    Number: string;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Regulator?: number;
    Reverser?: number;
    Brake?: number;
    Whistle?: number;
    Generator?: number;
    Compressor?: number;
    BoilerPressure?: number;
    MaxBoilerPressure?: number;
    WaterTemperature?: number;
    WaterLevel?: number;
    MaxWaterLevel?: number;
    AirPressure?: number;
    FireTemperature?: number;
    FuelAmount?: number;
    MaxFuelAmount?: number;
    Speed?: number;
    MaxSpeed?: number;
    Freight?: Storage;
    Tender?: {
        FuelAmount: number;
        MaxFuelAmount: number;
        WaterLevel: number;
        MaxWaterLevel: number;
    };
    Couplings: {
        RearID?: number;
        FrontID?: number;
        FrontCoupled: boolean;
        RearCoupled: boolean;
    };
    SyncControls: boolean;
}

export interface Player {
    ID: number;
    Name: string;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    WalkSpeed?: number;
    FlySpeed?: number;
}

export interface Switch {
    ID: number;
    Type: SwitchType;
    Side: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Turntable {
    ID: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Deck    : [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Spline {
    ID: number;
    Type: SplineType;
    Segments: SplineSegment[];
}

export interface SplineSegment {
    Visible       : boolean;
    LocationStart : [ X: number, Y: number, Z: number ];
    LocationEnd   : [ X: number, Y: number, Z: number ];
}

export interface WaterTower {
    ID: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Storage : Storage;
}

export interface Sandhouse {
    ID: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Storage: Storage;
}

export interface Industry {
    ID: number;
    Type: IndustryType;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Educts  : Storage[];
    Products: Storage[];
}

export interface Storage {
    Type: string;
    Amount: number;
    Max: number;
}

export interface DataChange<T = unknown> {
    Array: string;
    Index: number;

    ChangeType: 'ADD' | 'REMOVE' | 'UPDATE';
    Data?: T;
}

export interface World {
    Frames: Frame[];
    Players: Player[];
    Switches: Switch[];
    Turntables: Turntable[];
    WaterTowers: WaterTower[];
    Sandhouses: Sandhouse[];
    Industries: Industry[];
    Splines: Spline[];
}