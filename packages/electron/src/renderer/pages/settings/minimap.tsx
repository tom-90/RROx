import { Form, FormInstance, Select, Switch } from 'antd';
import React from 'react';

export function MinimapSettings( { settings }: { settings: any, form: FormInstance } ) {
    return <>
        <Form.Item
            label="Show Minimap"
            name="minimap.enabled"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Enable Transparent Mode"
            name="minimap.transparent"
            valuePropName="checked"
        >
            <Switch disabled={!settings[ 'minimap.enabled' ]}/>
        </Form.Item>
        <Form.Item
            label="Minimap Location"
            name="minimap.corner"
        >
            <Select style={{ maxWidth: 300 }} disabled={!settings[ 'minimap.enabled' ]}>
                <Select.Option value={1}>Top Left</Select.Option>
                <Select.Option value={2}>Top Right</Select.Option>
                <Select.Option value={3}>Bottom Left</Select.Option>
                <Select.Option value={4}>Bottom Right</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item
            label="Hardware Acceleration"
            name="hardware-acceleration"
            valuePropName="checked"
            help={<p style={{ padding: '10px 0' }}>Disable hardware acceleration if the game window shows a black screen. RROx needs to be restarted for changes to take effect.</p>}
        >
            <Switch/>
        </Form.Item>
    </>;
}