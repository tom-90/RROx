import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Slider } from "antd";

import '@rrox/assets/css/controls/SliderControl.scss';
import LeverBg from '@rrox/assets/images/controls/lever/background.png';

export function CustomSlider( { callback, disabled, value, min, max, step, text }: {
    callback : any,
    disabled?: boolean,
    value?: number,
    min?: number,
    max?: number
    step?: number,
    text?: string
} ) {
    const [ sliderVal, setSliderVal] = useState(value);

    const generateLabel = () => {
        if (text != undefined){
            return (<span className="slider-label">{text.substring(0, 11)}</span>);
        }
        return (<span/>);
    };

    return (
        <div className="slider-control">

            {generateLabel()}
            <img src={LeverBg} alt="background"/>
            <Slider
                vertical
                min={min != undefined ? min : 0}
                max={max != undefined ? max : 100}
                value={sliderVal}
                step={step != undefined ? step : 1}
                tipFormatter={( value ) => value + '%'}
                tooltipPlacement={'left'}
                disabled={disabled}
                onChange={( value: number ) => setSliderVal(value) }
                onAfterChange={( value: number ) => callback(value) }
            />

        </div>
    );
}