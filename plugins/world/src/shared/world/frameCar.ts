import { ILocation } from "./location";
import { IRotation } from "./rotation";

export interface IFrameCar {
    type: string;
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
    
    freight?: {
        type: string;
        amount: number;
        maxAmount: number;
    }

    couplers: {
        front?: {
            isCoupled: boolean;
        }

        rear?: {
            isCoupled: boolean;
        }
    }
}