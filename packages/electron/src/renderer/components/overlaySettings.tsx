import { useSettings } from "@rrox/api";
import React, { useEffect } from "react";
import { Form, Switch, Select } from "antd";
import { BaseSettings } from "../../shared";
import { KeybindInput } from "@rrox/base-ui";

export function OverlaySettings() {
    const [ settings, store ] = useSettings( BaseSettings );
    const [ form ] = Form.useForm();

    useEffect( () => {
        form.setFieldsValue( settings );
    }, [ settings ] );

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
            label="Enable Overlay"
            name="overlay.enabled"
            valuePropName="checked"
        >
            <Switch/>
        </Form.Item>
        <Form.Item
            label="Set Overlay Keybind"
            name="overlay.keybind"
        >
            <KeybindInput
                disabled={!settings[ 'overlay.enabled' ]}
            />
        </Form.Item>
        <Form.Item
            label="Hardware Acceleration"
            name="hardware-acceleration"
            valuePropName="checked"
            help={<p style={{ padding: '10px 0' }}>Disable hardware acceleration if the game window shows a black screen. RROx needs to be restarted for changes to take effect.</p>}
        >
            <Switch/>
        </Form.Item>
    </Form>;
}