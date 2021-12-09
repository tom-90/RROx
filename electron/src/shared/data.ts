export interface Frame {
    Type: string;
    Name: string;
    Number: string;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Regulator?: number;
    Reverser?: number;
    Brake?: number;
}

export interface Player {
    Name: string;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Switch {
    Type: number;
    Side: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Turntable {
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
    Deck    : [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Spline {
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
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
}

export interface Industry {
    Type: number;
    Location: [ X: number, Y: number, Z: number ];
    Rotation: [ Pitch: number, Yaw: number, Roll: number ];
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