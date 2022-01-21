import React from 'react';

import '@rrox/assets/css/controls/GuageControl.scss';
import GuageBorder from '@rrox/assets/images/controls/guage/border.png';
import BigNeedle from '@rrox/assets/images/controls/guage/big_needle.png';
import MaxNeedle from '@rrox/assets/images/controls/guage/max_needle.png';

import BoilerPressure from '@rrox/assets/images/controls/guage/boiler_pressure.png';
import BrakePressure from '@rrox/assets/images/controls/guage/brake_pressure.png';
import FireTemp from '@rrox/assets/images/controls/guage/fire_temprature.png';
import WaterTemp from '@rrox/assets/images/controls/guage/water_temprature.png';
import CurrentSpeed from '@rrox/assets/images/controls/guage/current_speed.png';

export enum GuageType {
    BOILER_PRESSUERE = 0,
    BRAKE_PRESSUERE = 1,
    FIRE_TEMPRATURE = 2,
    WATER_TEMPRATURE = 3,
    SPEED = 4
}

const TypeDefinitions : any = {
    [ GuageType.BOILER_PRESSUERE ]: { Background: BoilerPressure, MaxVal: 160 },
    [ GuageType.BRAKE_PRESSUERE ]: { Background: BrakePressure, MaxVal: 160 },
    [ GuageType.FIRE_TEMPRATURE ]: { Background: FireTemp, MaxVal: 640 },
    [ GuageType.WATER_TEMPRATURE ]: { Background: WaterTemp, MaxVal: 160 },
    [ GuageType.SPEED ]: { Background: CurrentSpeed, MaxVal: 32},
};

export function Gauge( { type, value, max, size}: {
    type: GuageType,
    value: number
    max?: number,
    size?: number
} ) {

    let mainCss = {};
    if (size != undefined){
        mainCss = {
            width: size+'px',
            height: size+'px'
        };
    }

    let TypeDef = TypeDefinitions[type];
    let BigNeedleRotation = (290 / TypeDef.MaxVal) * value;
    let BigNeedleCss = {
        transform: `rotate(${BigNeedleRotation}deg)`
    };
    let MaxNeedleRotation = (290 / TypeDef.MaxVal) * max;
    let MaxNeedleCss = {
        transform: `rotate(${MaxNeedleRotation}deg)`,
        display: max == undefined ? 'none' : ''
    };

    return (
        <div className="guage-control" style={mainCss}>
            <img src={GuageBorder} alt="GuageBorder" className="GuageBorder"/>
            <img src={BigNeedle} alt="BigNeedle" style={BigNeedleCss}/>
            <img src={MaxNeedle} alt="MaxNeedle" style={MaxNeedleCss}/>
            <img src={TypeDef.Background} alt="MaxNeedle" className="Background"/>
        </div>
    );
}