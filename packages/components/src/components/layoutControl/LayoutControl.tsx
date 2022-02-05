import React, {useEffect, useMemo, useState, useRef, useLayoutEffect} from "react";
import {UncontrolledReactSVGPanZoom} from 'react-svg-pan-zoom';
import {Button, Input, InputNumber, Radio, Tabs} from "antd";
import {MenuOutlined} from '@ant-design/icons';
import {TrackPieces, TrackTypes} from "@rrox/types/src/layout/trackPieces";
import TextArea from "antd/es/input/TextArea";
import Canvg from 'canvg';

const { TabPane } = Tabs;

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

export function LayoutControl({ editMode }: {
    editMode?: boolean
}){
    const Viewer = useRef(null);
    const [ currentTool, setCurrentTool ] : [ TrackTypes, any ] = useState(TrackTypes.none);
    const [ rows, setRows ] = useState(20);
    const [ columns, setColumns] = useState(60);
    const [ layoutName, setLayoutName] = useState('');
    const [ layoutDescription, setLayoutDescription] = useState('');
    const width = 20;
    const height = 20;
    const editable = editMode || false;

    const [ squares, setSquares ] : [ valueObject[], any ] = useState([]);
    const [ squareContent, setSquareContent ] : [ {
            [ key: string ] : {
                trackType: TrackTypes,
                switchState: boolean
            }
        }, any ] = useState({});

    const saveToImg = async () => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const svgViewer = '<svg>'+document.querySelector('.layout-map svg g').innerHTML+'</svg>';

        let pngRenderer = await Canvg.from(ctx, svgViewer);
        pngRenderer.resize(columns * width, rows * height);
        await pngRenderer.render();

        Viewer.current.fitToViewer();
        return canvas.toDataURL();
    };

    useEffect(() => {
        if (Object.keys(squareContent).length === 0) return;
        let data = {
            content: squareContent,
            settings: {
                rows: rows,
                columns: columns,
                name: layoutName,
                description: layoutDescription
            }
        }
        window.localStorage.setItem('LayoutSquareContent', JSON.stringify(data));
    }, [squareContent, rows, columns]);

    useEffect(() => {
        const newSquares = [];
        if (window.localStorage.getItem('LayoutSquareContent')){
            let data = JSON.parse(window.localStorage.getItem('LayoutSquareContent'));

            setRows(data.settings.rows);
            setColumns(data.settings.columns);
            setLayoutName(data.settings.name);
            setLayoutDescription(data.settings.description);

            if (Object.keys(data.content).length === 0) return;
            setSquareContent(data.content);
        }

        for (let i1 = 0; i1 < columns; i1++) {
            for (let i2 = 0; i2 < rows; i2++) {
                let x = i1 * width;
                let y = i2 * height;
                let key = x+';'+y;

                newSquares.push({
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
            }
        }
        Viewer.current.setPointOnViewerCenter(rows * width * 1.5, columns * height / 5, 1.2);
        setSquares(newSquares);
    }, [rows, columns]);

    const drawSquares = useMemo(() => {
        return (<g>
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
                    <TrackPieces trackKey={key} type={squareContent[key]?.trackType} switchState={squareContent[key]?.switchState} x={x} y={y} width={width} height={height} />
                </g>
            )}
        </g>);
    }, [squares, squareContent, rows, columns, currentTool]);

    return (
        <div className="layout-control">
            <canvas style={{display: 'none'}} />

            <UncontrolledReactSVGPanZoom
                width={window.innerWidth - 300}
                height={window.innerHeight - 64}
                tool="auto"
                toolbarProps={{position: 'none'}}
                // @ts-ignore
                miniatureProps={{position: 'none'}}
                className="layout-map"
                preventPanOutside={false}
                scaleFactorMin={0.5}
                scaleFactorMax={6}
                scaleFactor={0.8}
                ref={Viewer}
            ><svg width={0} height={0}>{drawSquares}</svg></UncontrolledReactSVGPanZoom>

            <div className="toolbar">

                <div className="menuBtn">
                    <MenuOutlined />
                </div>

                <Tabs>

                    { editable &&  <TabPane tab="Designer" key="designer" className="tools">
                        <Radio.Group value={currentTool} onChange={(e) => {
                            setCurrentTool(e.target.value);
                        }}>
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
                    </TabPane>}
                    { editable && <TabPane tab="Settings" key="settings" className="settings">

                        <InputNumber style={{width: '100%'}} addonBefore="Rows" min={5} max={80} value={rows} onChange={(value) => setRows(value)} />
                        <InputNumber style={{marginTop: '5px', width: '100%'}} addonBefore="Columns" min={5} max={80} value={columns} onChange={(value) => setColumns(value)} />

                    </TabPane>}
                    <TabPane tab="Info" key="info" className="info">

                        <p>TODO</p>

                    </TabPane>
                    <TabPane tab="Save" key="save" className="save">

                        <Input style={{width: '100%'}}  addonBefore="Name*" required={true} value={layoutName} onChange={(e) => setLayoutName(e.target.value)} />
                        <p style={{marginTop: '5px', marginBottom: '0'}}>Description:</p>
                        <TextArea rows={4} allowClear={true} style={{width: '100%'}} onChange={(e) => setLayoutDescription(e.target.value)} />

                        <Button style={{marginTop: '5px'}} type="primary" block={true} onClick={() => {
                            saveToImg().then(r => {
                                console.log(r);
                            });
                            //alert("TODO // PUBLISHED AS "+layoutName);
                        }}>Publish</Button>
                        <small>All fields with a * are required</small>

                    </TabPane>
                </Tabs>
            </div>
        </div>
    );

}