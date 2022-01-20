import React from 'react';

import '@rrox/assets/css/controls/WaterSight.scss';
import SightBorder from '@rrox/assets/images/controls/sight/border.png';
import WaterBackground from '@rrox/assets/images/controls/sight/water_texture.jpg';

export function Sight( { value, size }: {
    value: number,
    size?: number
}){

    let mainCss = {};
    if (size != undefined){
        mainCss = {
            width: size+'px',
            height: size*2+'px'
        };
    }

    let fillLevelCss = {
        height: `${value}%`,
        backgroundImage: `url("${WaterBackground}"), linear-gradient(rgba(0, 146, 203, 0.8), rgba(0, 146, 203, 0.8))`
    };

    return (
        <div className="sight-control" style={mainCss}>
            <img src={SightBorder} alt="border"/>

            <div className="fill-level-box">
                <div className="fill-level" style={fillLevelCss} />
            </div>

        </div>
    );
}