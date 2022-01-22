import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Konva from "konva";
import { Stage, Layer, Rect, Line, Circle } from "react-konva";

import '@rrox/assets/css/controls/WissleControl.scss';
import WissleBg from '@rrox/assets/images/controls/wissle/background.png';

export function Whistle({ onChange, onAfterChange }: {
    onChange? : any,
    onAfterChange? : any
} ) {

    const localOnChange = (value : number) => {
        let value_ = value;
        if (value_ < 2){ value_ = 0; }
        if (value_ > 50){ value_ = 50; }
        if (onChange != undefined){
            onChange(value_ * 2);
        }
    }
    const localOnAfterChange = (value : number) => {
        let value_ = value;
        if (value_ < 2){ value_ = 0; }
        if (value_ > 50){ value_ = 50; }
        if (onAfterChange != undefined){
            onAfterChange(value_ * 2);
        }
    }

    let canvasHeight = 200;
    const [ wissleVal, setWissleVal] = useState(0);
    const [ springEnabled, setSpringEnabled] = useState(true);

    return (
        <div className="whistle-control">

            <span className="whistle-label">Whistle</span>
            <img src={WissleBg} alt="background"/>
            <Stage width={300} height={canvasHeight}>
                <Layer>

                    <Line
                        x={60}
                        y={80}
                        points={[wissleVal * 0.1, wissleVal, 180, 0]}
                        stroke='#1a1a1a'
                        strokeWidth={35}
                        lineCap='round'
                    />
                    <Circle
                        x={(wissleVal * 0.1) + 60}
                        y={wissleVal + 80}
                        radius={25}
                        fill='#3a3a3a'
                    />
                    <Circle
                        x={240}
                        y={80}
                        radius={12}
                        fill='#2d2d2d'
                    />
                    <Rect
                        x={228}
                        y={78.5}
                        width={24}
                        height={4}
                        fill='#4a4a4a'
                        cornerRadius={1.5}
                    />

                    <Circle
                        x={180}
                        y={30}
                        radius={6}
                        fill='#525252'
                        onClick={() => {
                            setWissleVal(0);
                            setSpringEnabled(!springEnabled);
                            localOnChange(0);
                        }}
                    />
                    <Circle
                        x={(wissleVal * 0.1) + 180}
                        y={(wissleVal * 0.3) + 80}
                        radius={6}
                        fill='#525252'
                        onClick={() => {
                            setWissleVal(0);
                            setSpringEnabled(!springEnabled);
                            localOnChange(0);
                        }}
                    />
                    <Line
                        x={180}
                        y={30}
                        points={[0, 0, (wissleVal * 0.1), (wissleVal * 0.3) + 50]}
                        stroke={springEnabled ? '#919191' : 'rgba(0,0,0,0)'}
                        strokeWidth={5}
                        lineCap='round'
                        onClick={() => {
                            setWissleVal(0);
                            setSpringEnabled(!springEnabled);
                            localOnChange(0);
                        }}
                    />

                    <Rect
                        x={(wissleVal * 0.1) + 30}
                        y={wissleVal + 50}
                        width={60}
                        height={60}
                        fill='rgba(255, 0, 0, 0)'
                        draggable
                        onDragMove={(e) => {
                            let x = e.target.attrs.x;
                            let y = e.target.attrs.y;
                            let height = e.target.attrs.height;

                            e.target.attrs.x = (wissleVal * 0.1) + 30;
                            if (y <= 45){
                                e.target.attrs.y = 45;
                                return;
                            }
                            if (y >= 105){
                                e.target.attrs.y = 105;
                                return;
                            }
                            let newWissleVal = y - 50;
                            if(newWissleVal < 0){ newWissleVal = 0; }
                            if(newWissleVal > 50){ newWissleVal = 50; }

                            setWissleVal(newWissleVal);
                            localOnChange(newWissleVal);
                        }}
                        onDragEnd={(e) => {
                            if (wissleVal > 0 && springEnabled){
                                setWissleVal(0);
                                localOnChange(0);
                            }
                            localOnAfterChange(wissleVal);
                        }}
                    />

                </Layer>
            </Stage>

        </div>
    );
}