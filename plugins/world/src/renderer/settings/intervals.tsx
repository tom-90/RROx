import React, { useEffect } from "react";
import { Form, Slider } from "antd";
import { WorldSettings } from "../../shared";
import { useSettings } from "@rrox/api";

export function IntervalSettings() {
    const [ settings, store ] = useSettings( WorldSettings );
    const [ form ] = Form.useForm();
    
    const MapSliderMilliseconds = { 0: 500, 10: 1000, 20: 2000, 30: 3000, 40: 4000, 50: 5000, 70: 10000, 100: 30000 };

    useEffect( () => {
        form.setFieldsValue( settings );
    }, [ settings ] );

    return <Form
        name="settings"
        layout="vertical"
        form={form}
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => store.setAll( changed )}
        autoComplete="off"
    >
        <Form.Item
            label="World Refresh Interval"
            name={[ 'intervals', 'world' ]}
            help={<p style={{ padding: '10px 0' }}>Use this slider to adjust the refresh time for all objects on the map (except splines) for optimized performance.</p>}
            normalize={( sliderVal ) => {
                return ( MapSliderMilliseconds as any )[ sliderVal ];
            }}
            getValueProps={( savedVal ) => {
                return {
                    value: Object.entries( MapSliderMilliseconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                };
            }}
        >
            <Slider style={{ marginLeft: 20 }} marks={{
                0: '0.5s',
                10: '1s',
                20: '2s',
                30: '3s',
                40: '4s',
                50: '5s',
                70: '10s',
                100: '30s',
            }} step={null} tooltipVisible={false} included={false}/>
        </Form.Item>
        <Form.Item
            label="Spline Refresh Interval"
            name={[ 'intervals', 'splines' ]}
            help={<p style={{ padding: '10px 0' }}>
                Use this slider to adjust the refresh time for all splines on the map.
                As splines do not change often, and take a large hit on performance when refreshing the map, it is recommended to set this value to be higher than the world refresh interval.
            </p>}
            normalize={( sliderVal ) => {
                return ( MapSliderMilliseconds as any )[ sliderVal ];
            }}
            getValueProps={( savedVal ) => {
                return {
                    value: Object.entries( MapSliderMilliseconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                };
            }}
        >
            <Slider style={{ marginLeft: 20 }} marks={{
                0: '0.5s',
                10: '1s',
                20: '2s',
                30: '3s',
                40: '4s',
                50: '5s',
                70: '10s',
                100: '30s',
            }} step={null} tooltipVisible={false} included={false}/>
        </Form.Item>
    </Form>;
}