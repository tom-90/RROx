import { Form, FormInstance, Switch } from 'antd';
import React from 'react';

export function FeaturesSettings( {}: { settings: any, form: FormInstance } ) {
    return <>
        <Form.Item
            help={<p style={{ padding: '10px 0', marginTop: -45 }}>Enable or disable one or more RROx features.</p>}
        />
        <Form.Item
            label="Control Engines"
            name="features.controlEngines"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Control Switches"
            name="features.controlSwitches"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Teleport"
            name="features.teleport"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Build Mode"
            name="features.build"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Cheats"
            name="features.cheats"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
    </>;
}