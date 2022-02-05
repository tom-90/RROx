import { Button, Form, FormInstance, Select, Slider, Switch } from 'antd';
import React from 'react';

export function AutosaveSettings( { settings }: { settings: any, form: FormInstance } ) {
    const AutosaveSliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };

    return <>
        <Form.Item
            label="Enable"
            name="autosave.enabled"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Slots"
            name="autosave.slots"
        >
            <Select
                style={{ maxWidth: 300 }}
                mode={'multiple'}
            >
                <Select.Option value={1}>Slot 1</Select.Option>
                <Select.Option value={2}>Slot 2</Select.Option>
                <Select.Option value={3}>Slot 3</Select.Option>
                <Select.Option value={4}>Slot 4</Select.Option>
                <Select.Option value={5}>Slot 5</Select.Option>
                <Select.Option value={6}>Slot 6</Select.Option>
                <Select.Option value={7}>Slot 7</Select.Option>
                <Select.Option value={8}>Slot 8</Select.Option>
                <Select.Option value={9}>Slot 9</Select.Option>
                <Select.Option value={10}>Slot 10</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item
            label="Interval"
            name="autosave.interval"
            normalize={( sliderVal ) => {
                return ( AutosaveSliderSeconds as any )[ sliderVal ];
            }}
            getValueProps={( savedVal ) => {
                return {
                    value: Object.entries( AutosaveSliderSeconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                };
            }}
        >
            <Slider style={{ marginLeft: 20 }} marks={{
                0: '10s',
                7: '30s',
                15: '1m',
                23: '2m',
                35: '5m',
                50: '10m',
                65: '15m',
                80: '20m',
                100: '30m',
            }} step={null} tooltipVisible={false} included={false} />
        </Form.Item>
        <Form.Item>
            <Button
                type="default"
                disabled={!settings[ 'autosave.enabled' ]}
                onClick={() => {
                    window.ipc.send( 'autosave' );
                }}
            >
                Autosave now
            </Button>
        </Form.Item>
    </>;
}