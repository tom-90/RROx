import React, {useEffect, useState} from "react";
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import { Radio } from "antd";
import { TrackTypes, TrackPieces } from "@rrox/types/src/layout/trackPieces";

interface valueObject {
    key: number,
    x: number,
    y: number,
    props: {
        color : string,
        fillColor: string,
        fillColorHover:  string,
        strokeWidth: number,
    }
}

export function LayoutControl({  }: {

}){
    const [ squares, setSquares ] : [
        valueObject[],
        any
    ] = useState([]);
    const [ squareContent, setSquareContent ] : [
        {
            [ key: string ] : {
                trackType: TrackTypes,
                switchState: boolean
            }
        },
        any ] = useState({});

    useEffect(() => {
        if (Object.keys(squareContent).length === 0) return;
        window.localStorage.setItem('LayoutSquareContent', JSON.stringify(squareContent));
    }, [squareContent]);

    const [ currentTool, setCurrentTool ] : [ TrackTypes, any ] = useState(TrackTypes.none);

    const rows = 20;
    const columns = 60;
    const width = 20;
    const height = 20;
    const editable = true;

    useEffect(() => {
        if (window.localStorage.getItem('LayoutSquareContent')){
            let tempSquareContent = JSON.parse(window.localStorage.getItem('LayoutSquareContent'));
            if (Object.keys(tempSquareContent).length === 0) return;
            setSquareContent(tempSquareContent);
        }

        let key = 0;
        for (let i1 = 0; i1 < columns; i1++) {
            for (let i2 = 0; i2 < rows; i2++) {
                let x = i1 * width;
                let y = i2 * height;

                squares.push({
                    key: key,
                    x: x,
                    y: y,
                    props: {
                        color: "#808080",
                        fillColor: "#9e9e9e",
                        fillColorHover: "#8a8a8a",
                        strokeWidth: 1,
                    }
                });

                if (!squareContent[key]){
                    squareContent[key] = {
                        trackType: TrackTypes.none,
                        switchState: false
                    };
                }

                key++;
            }
        }

    }, []);

    return (
        <div className="layout-control">
            <UncontrolledReactSVGPanZoom
                width={window.innerWidth}
                height={window.innerHeight - 64}
                tool="auto"
                toolbarProps={{position: 'none'}}
                // @ts-ignore
                miniatureProps={{position: 'none'}}
                className="layout-map"
                preventPanOutside={false}
                scaleFactorMin={0.8}
                scaleFactorMax={6}
                scaleFactor={0.8}
            >
                <svg width={0} height={0}>
                    {squares.map(({key, x, y, props}) => <g key={'layout-square-'+key}>
                        <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={props.color}
                            stroke={editable ? props.fillColor : 'transparent'}
                            strokeWidth={editable ? props.strokeWidth : 0}
                            style={{zIndex: 20}}
                            onClick={() => {
                                if (editable) {
                                    let newSquareContent = {...squareContent};
                                    newSquareContent[key].trackType = currentTool;
                                    setSquareContent(newSquareContent);
                                }else if (squareContent[key].trackType === TrackTypes.switch_horizontal_bottom_left){
                                    let newSquareContent = {...squareContent};
                                    newSquareContent[key].switchState = !newSquareContent[key].switchState;
                                    setSquareContent(newSquareContent);
                                }
                            }}
                            />
                        <TrackPieces trackKey={key} type={squareContent[key].trackType} switchState={squareContent[key].switchState} x={x} y={y} width={width} height={height} />
                    </g>
                    )}
                </svg>
            </UncontrolledReactSVGPanZoom>
            <div className="toolbar">
                <h1>Tools</h1>
                <div className="tools">
                    <Radio.Group value={currentTool} onChange={(e) => setCurrentTool(e.target.value)}>
                        <Radio value={TrackTypes.none} key="none">None</Radio>
                        <Radio value={TrackTypes.track_horizontal} key="track_horizontal">Track Horizontal</Radio>
                        <Radio value={TrackTypes.track_vertical} key="track_vertical">Track Vertical</Radio>
                        <Radio value={TrackTypes.track_diagonal_left} key="track_diagonal_left">Track Diagonal Left</Radio>
                        <Radio value={TrackTypes.track_diagonal_right} key="track_diagonal_right">Track Diagonal Right</Radio>
                        <Radio value={TrackTypes.track_cross} key="track_cross">Track Cross</Radio>

                        <Radio value={TrackTypes.corner_top_bottom_left} key="corner_top_bottom_left">Corner Top to Bottom Left</Radio>
                        <Radio value={TrackTypes.corner_top_bottom_right} key="corner_top_bottom_right">Corner Top to Bottom Right</Radio>
                        <Radio value={TrackTypes.corner_bottom_top_left} key="corner_bottom_top_left">Corner Bottom to Top Left</Radio>
                        <Radio value={TrackTypes.corner_bottom_top_right} key="corner_bottom_top_right">Corner Bottom to Top Right</Radio>
                        <Radio value={TrackTypes.corner_left_top_right} key="corner_left_top_right">Corner Left to Top Right</Radio>
                        <Radio value={TrackTypes.corner_left_bottom_right} key="corner_left_bottom_right">Corner Left to Bottom Right</Radio>
                        <Radio value={TrackTypes.corner_right_top_left} key="corner_right_top_left">Corner Right to Top Left</Radio>
                        <Radio value={TrackTypes.corner_right_bottom_left} key="corner_right_bottom_left">Corner Right to Bottom Left</Radio>

                        <Radio value={TrackTypes.switch_horizontal_bottom_left} key="switch_horizontal_bottom_left">Switch Horizontal to Bottom Left</Radio>
                        <Radio value={TrackTypes.switch_horizontal_bottom_right} key="switch_horizontal_bottom_right">Switch Horizontal to Bottom Right</Radio>
                        <Radio value={TrackTypes.switch_horizontal_top_left} key="switch_horizontal_top_left">Switch Horizontal to Top Left</Radio>
                        <Radio value={TrackTypes.switch_horizontal_top_right} key="switch_horizontal_top_right">Switch Horizontal to Top Right</Radio>
                        <Radio value={TrackTypes.switch_vertical_bottom_left} key="switch_vertical_bottom_left">Switch Vertical to Bottom Left</Radio>
                        <Radio value={TrackTypes.switch_vertical_bottom_right} key="switch_vertical_bottom_right">Switch Vertical to Bottom Right</Radio>
                        <Radio value={TrackTypes.switch_vertical_top_left} key="switch_vertical_top_left">Switch Vertical to Top Left</Radio>
                        <Radio value={TrackTypes.switch_vertical_top_right} key="switch_vertical_top_right">Switch Vertical to Top Right</Radio>

                        <Radio value={TrackTypes.switch_diagonal_left_left} key="switch_diagonal_left_left">Switch Diagonal Left To Left</Radio>
                        <Radio value={TrackTypes.switch_diagonal_left_right} key="switch_diagonal_left_right">Switch Diagonal Left To Right</Radio>
                        <Radio value={TrackTypes.switch_diagonal_left_top} key="switch_diagonal_left_top">Switch Diagonal Left To Top</Radio>
                        <Radio value={TrackTypes.switch_diagonal_left_bottom} key="switch_diagonal_left_bottom">Switch Diagonal Left To Bottom</Radio>
                        <Radio value={TrackTypes.switch_diagonal_right_left} key="switch_diagonal_right_left">Switch Diagonal Right To Left</Radio>
                        <Radio value={TrackTypes.switch_diagonal_right_right} key="switch_diagonal_right_right">Switch Diagonal Right To Right</Radio>
                        <Radio value={TrackTypes.switch_diagonal_right_top} key="switch_diagonal_right_top">Switch Diagonal Right To Top</Radio>
                        <Radio value={TrackTypes.switch_diagonal_right_bottom} key="switch_diagonal_right_bottom">Switch Diagonal Right To Bottom</Radio>

                        <Radio value={TrackTypes.end_right} key="end_right">End Right</Radio>
                        <Radio value={TrackTypes.end_left} key="end_left">End Left</Radio>
                        <Radio value={TrackTypes.end_top} key="end_top">End Top</Radio>
                        <Radio value={TrackTypes.end_bottom} key="end_bottom">End Bottom</Radio>
                    </Radio.Group>
                </div>
            </div>
        </div>
    );

}