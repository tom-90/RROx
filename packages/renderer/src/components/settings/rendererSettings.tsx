import React, { useEffect } from "react";
import { Theme, useSettings } from "@rrox/api";
import { Form, Switch, Input, Button } from "antd";
import { BaseRendererSettings } from "../../settings";

export function RendererSettings( { version, openLogFile }: { version?: string, openLogFile?: () => void } ) {
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
        onValuesChange={( changed ) => store.setAll( changed )}
        autoComplete="off"
        style={{ height: '100%', position: 'relative' }}
    >
        <div style={{ height: 'calc(100% - 35px)' }}>
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
            {openLogFile && <Form.Item>
                <Button onClick={openLogFile}>Open Log file</Button>
            </Form.Item>}
        </div>
        {version && <Form.Item
        >
            <i>RROx - Version {version}</i>
        </Form.Item>}
    </Form>;
}