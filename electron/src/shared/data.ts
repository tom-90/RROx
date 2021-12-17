export interface Frame {
    ID: number;
    Type: string;
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
    WaterTemperature?: number;
    WaterLevel?: number;
    AirPressure?: number;
    FireTemperature?: number;
    FuelAmount?: number;
    Speed?: number;
    MaxSpeed?: number;
    Freight?: Storage;
}

export interface Player {
    ID: number;
    Name: string;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Switch {
    ID: number;
    Type: number;
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
    Type: number;
    Location: [ X: number, Y: number, Z: number ];
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

export interface Industry {
    ID: number;
    Type: number;
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
    Industries: Industry[];
    Splines: Spline[];
}