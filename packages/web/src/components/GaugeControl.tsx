import React from 'react';

import '@rrox/assets/css/controls/GuageControl.scss';
import GuageBorder from '@rrox/assets/images/controls/border.png';
import BigNeedle from '@rrox/assets/images/controls/big_needle.png';
import MaxNeedle from '@rrox/assets/images/controls/max_needle.png';

import BoilerPressure from '@rrox/assets/images/controls/boiler_pressure.png';
import BrakePressure from '@rrox/assets/images/controls/brake_pressure.png';
import FireTemp from '@rrox/assets/images/controls/fire_temprature.png';
import WaterTemp from '@rrox/assets/images/controls/water_temprature.png';
import CurrentSpeed from '@rrox/assets/images/controls/current_speed.png';

const TypeDefinitions : any = {
    [ 0 ]: { Background: BoilerPressure, MaxVal: 160 },
    [ 1 ]: { Background: BrakePressure, MaxVal: 160 },
    [ 2 ]: { Background: FireTemp, MaxVal: 640 },
    [ 3 ]: { Background: WaterTemp, MaxVal: 160 },
    [ 4 ]: { Background: CurrentSpeed, MaxVal: 32},
};

export function Gauge( { type, value, max }: {
    type: number,
    value: number
    max?: number
} ) {

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
        <div className="guage-control">
            <img src={GuageBorder} alt="GuageBorder" className="GuageBorder"/>
            <img src={BigNeedle} alt="BigNeedle" style={BigNeedleCss}/>
            <img src={MaxNeedle} alt="MaxNeedle" style={MaxNeedleCss}/>
            <img src={TypeDef.Background} alt="MaxNeedle" className="Background"/>
        </div>
    );
}