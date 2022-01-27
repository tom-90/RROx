import { Cars } from '@rrox/types/src/cars';

const TrainData : any = {
    [ Cars.PORTER ]: {
        TE: 2916,
        WT: 18000
    },
    [ Cars.PORTER2 ]: {
        TE: 2916,
        WT: 18000
    },
    [ Cars.CLASS70 ]: {
        TE: 15716,
        WT: 127260
    },
    [ Cars.EUREKA ]: {
        TE: 5620,
        WT: 65492
    },
    [ Cars.COOKE260 ]: {
        TE: 12063,
        WT: 103300
    },
    [ Cars.HEISLER ]: {
        TE: 13219,
        WT: 72345
    },
    [ Cars.CLIMAX ]: {
        TE: 17486,
        WT: 62293
    }
};

export function CalcGrade(cars: Cars[], Weight : number) : number {
    let totalTE = 0;
    let totalWeight = 0;

    cars.forEach(car => {
        let carData = TrainData[car];
        totalTE += carData.TE;
        totalWeight += Weight + carData.WT;
    });

    return (( totalTE / totalWeight) - 0.004 ) / 0.01;
}