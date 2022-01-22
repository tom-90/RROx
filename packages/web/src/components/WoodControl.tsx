import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import '@rrox/assets/css/controls/WoodLevelControl.scss';
import Background from '@rrox/assets/images/controls/wood_level/background.png'
import Border from '@rrox/assets/images/controls/wood_level/border.png';

export function WoodLevel({ percentage, size }: {
    percentage : number,
    size?: number
} ) {

    let mainCss = {};
    if (size != undefined){
        mainCss = {
            width: size+'px',
            height: size+'px'
        };
    }

    let LevelValue = percentage;
    let LevelCss = {
        height: `${LevelValue}%`
    };

    return (
        <div className="wood-control" style={mainCss}>

            <img src={Background} alt="background" className="background"/>
            <img src={Border} alt="border" className="border"/>
            <div className="level-div">
                <div className="level" style={LevelCss}></div>
            </div>
            <div className="label">Fuel</div>

        </div>
    );
}