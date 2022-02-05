import { BackgroundSettings } from '@rrox/components';
import { Form, FormInstance, Slider, Switch } from 'antd';
import React from 'react';

export function MapSettings( {}: { settings: any, form: FormInstance } ) {
    const MapSliderMilliseconds = { 0: 500, 10: 1000, 20: 2000, 30: 3000, 40: 4000, 50: 5000, 70: 7000, 100: 30000 };

    return <>
        <BackgroundSettings name="map.background" />
        <Form.Item
            label="Refresh Interval"
            name="map.refresh"
            help={<p style={{ padding: '10px 0' }}>Use this slider to adjust the map refresh time for optimized performance.</p>}
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
        <Form.Item name="site.darkMode" label="App Theme" valuePropName="checked">
            <Switch
                checkedChildren="Dark"
                unCheckedChildren="Light"
                onChange={( checked ) => {
                    document.body.setAttribute('data-theme', checked ? 'dark' : 'light');
                }}
            />
        </Form.Item>
    </>;
}