import { useSettings } from "@rrox/api";
import React, { useEffect } from "react";
import { Form, Switch, Select } from "antd";
import { MapPreferences } from "../../shared";

export function MinimapSettings() {
    const [ preferences, store ] = useSettings( MapPreferences );
    const [ form ] = Form.useForm();

    useEffect( () => {
        form.setFieldsValue( preferences );
    }, [ preferences ] );

    return <Form
        form={form}
        name="settings"
        layout="vertical"
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => store.set( changed )}
        autoComplete="off"
    >
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
            <Switch disabled={!preferences[ 'minimap.enabled' ]}/>
        </Form.Item>
        <Form.Item
            label="Minimap Location"
            name="minimap.corner"
        >
            <Select style={{ maxWidth: 300 }} disabled={!preferences[ 'minimap.enabled' ]}>
                <Select.Option value={1}>Top Left</Select.Option>
                <Select.Option value={2}>Top Right</Select.Option>
                <Select.Option value={3}>Bottom Left</Select.Option>
                <Select.Option value={4}>Bottom Right</Select.Option>
            </Select>
        </Form.Item>
    </Form>;
}