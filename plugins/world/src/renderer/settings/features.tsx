import React, { useEffect } from "react";
import { Form, Switch } from "antd";
import { WorldSettings } from "../../shared";
import { useSettings } from "@rrox/api";

export function FeaturesSettings() {
    const [ settings, store ] = useSettings( WorldSettings );
    const [ form ] = Form.useForm();

    useEffect( () => {
        form.setFieldsValue( settings );
    }, [ settings ] );

    return <Form
        name="settings"
        layout="vertical"
        form={form}
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => store.set( changed )}
        autoComplete="off"
    >
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
    </Form>;
}