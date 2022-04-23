import { FrameCarType } from "./enums";
import { ILocation } from "./location";
import { IRotation } from "./rotation";
import { IStorage } from "./storage";

export interface IFrameCar {
    type: FrameCarType;
    name: string;
    number: string;
    location: ILocation;
    rotation: IRotation;
    speedMs: number;
    maxSpeedMs: number;
    
    controls: {
        regulator?: number;
        reverser?: number;
        brake: number;
        whistle?: number;
        generator?: number;
        compressor?: number;
    }

    boiler?: {
        pressure: number;
        maxPressure: number;
        waterTemperature: number;
        waterAmount: number;
        maxWaterAmount: number;
        fireTemperature: number;
        fuel: number;
        maxFuel: number;
    }

    compressor?: {
        airPressure: number;
    }

    tender?: {
        fuel: number;
        maxFuel: number;
        water: number;
        maxWater: number;
    }
    
    freight?: IStorage;

    couplers: {
        front?: {
            isCoupled: boolean;
        }

        rear?: {
            isCoupled: boolean;
        }
    }
}