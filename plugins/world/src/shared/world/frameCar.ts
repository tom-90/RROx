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
            coupledToIndex?: number;
        }

        rear?: {
            isCoupled: boolean;
            coupledToIndex?: number;
        }
    };

    syncedControls: boolean;
}

export type CoupledFrameItem = {
    index    : number;
    frame    : IFrameCar,
    flipped  : boolean,
    isCoupled: boolean;
};

export function getCoupledFrames( frame: IFrameCar, index: number, frames: IFrameCar[] ) {
    const coupledFrames: CoupledFrameItem[] = [];

    const getCoupledFrame = ( frame: IFrameCar, type: 'front' | 'rear' ) => {
        if( type === 'front' && frame.couplers.front?.coupledToIndex != null )
            return { item: frames[ frame.couplers.front.coupledToIndex ], index: frame.couplers.front.coupledToIndex };
        else if( type === 'rear' && frame.couplers.rear?.coupledToIndex != null )
            return { item: frames[ frame.couplers.rear.coupledToIndex ], index: frame.couplers.rear.coupledToIndex };
    };

    const processFrame = ( frame: IFrameCar, index: number, prevItem: CoupledFrameItem, direction: 'forward' | 'backward' ) => {
        if( coupledFrames.find( ( f ) => f.frame === frame ) )
            return; // Prevent infinite recursion

        let flipped = prevItem.flipped;
        let isCoupled = prevItem.isCoupled;
        let next: { item: IFrameCar, index: number } | undefined = undefined;

        if( frame.couplers.front?.coupledToIndex === prevItem.index ) {
            if( index === prevItem.frame.couplers.front?.coupledToIndex )
                flipped = !flipped;

            next = getCoupledFrame( frame, 'rear' );
            isCoupled = isCoupled && frame.couplers.front.isCoupled;
        } else if( frame.couplers.rear?.coupledToIndex === prevItem.index ) {
            if( index === prevItem.frame.couplers.rear?.coupledToIndex )
                flipped = !flipped;

            next = getCoupledFrame( frame, 'front' );
            isCoupled = isCoupled && frame.couplers.rear.isCoupled;
        }

        const item = { frame, flipped, isCoupled, index };

        if( direction === 'forward' )
            coupledFrames.unshift( item );
        else if( direction === 'backward' )
            coupledFrames.push( item );

        if( next )
            processFrame( next.item, next.index, item, direction );
    };

    const item = { frame, index, flipped: false, isCoupled: true };
    coupledFrames.push( item );
    const coupledFront = getCoupledFrame( frame, 'front' );
    const coupledRear = getCoupledFrame( frame, 'rear' );

    if( coupledFront )
        processFrame( coupledFront.item, coupledFront.index, item, 'forward'  );
    if( coupledRear )
        processFrame( coupledRear.item, coupledRear.index, item, 'backward' );

    return coupledFrames;
}

const EngineTypes = [ 'porter_040', 'porter_042', 'handcar', 'eureka', 'climax', 'heisler', 'class70', 'cooke260', 'montezuma', 'glenbrook', 'shay', '622D', 'mosca', 'cooke280' ];

export function isEngine( frame: IFrameCar ) {
    return EngineTypes.includes( frame.type );
}