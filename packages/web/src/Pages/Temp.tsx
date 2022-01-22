import React, { useState } from 'react';

import { Gauge, GuageType } from '../components/GaugeControl';
import { Sight } from '../components/SightControl';
import { CustomSlider } from '../components/SliderControl';
import { Whistle } from '../components/WhistleControl';
import { WoodLevel } from '../components/WoodControl';

export function Temp() {
    // TODO
    // Feul amount

    const [ test1, setTest1] = useState(0);
    const [ test2, setTest2] = useState(0);

    const sliderChange = (value : number) => {
        setTest1(value);
    }
    const whistleChange = (value : number) => {
        setTest2(value);
    }

    return (
        <div className="page-container key-input-body">

            <Gauge type={GuageType.BOILER_PRESSUERE} value={test1} max={280} size={200} />

            <Sight percentage={0} size={100} />

            <CustomSlider onChange={sliderChange} text="Regulator" />

            <Whistle onChange={whistleChange} />

            <WoodLevel percentage={test2} size={200} />

        </div>
    );
}