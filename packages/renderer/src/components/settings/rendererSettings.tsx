import React, { useEffect } from "react";
import { Theme, useSettings } from "@rrox/api";
import { Form, Switch, Input } from "antd";
import { BaseRendererSettings } from "../../settings";

export function RendererSettings() {
    const [ settings, store ] = useSettings( BaseRendererSettings );
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
            name="theme"
            label="App Theme"
            valuePropName="checked"
            getValueFromEvent={( value ) => value ? Theme.DARK : Theme.LIGHT}
            getValueProps={( value ) => ( { checked: value === Theme.DARK } )}
        >
            <Switch
                checkedChildren="Dark"
                unCheckedChildren="Light"
            />
        </Form.Item>
        <Form.Item
            label="Player Name"
            name="player-name"
            valuePropName="checked"
            help={<p style={{ padding: '10px 0' }}>To connect to remote sessions using RROx, it is necessary to provide your player name.</p>}
        >
            <Input placeholder='Steam Player Name' />
        </Form.Item>
    </Form>;
}