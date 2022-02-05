import { Button, Form, FormInstance, Switch } from 'antd';
import React from 'react';

export function MinizwergSettings( {}: { settings: any, form: FormInstance } ) {
    return <>
        <Form.Item
            label="Upload autosaves to Minizwerg"
            name="minizwerg.enabled"
            valuePropName="checked"
            help={<p style={{ padding: '10px 0' }}>Uploading to Minizwerg happens at most every 15 minutes</p>}
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Make Minizwerg saves public"
            name="minizwerg.public"
            valuePropName="checked"
            help={window.settingsStore.get( 'minizwerg.url' ) ? <Button
                style={{ margin: '10px 0' }}
                onClick={() => window.openBrowser( window.settingsStore.get( 'minizwerg.url' ) as string )}
            >
                Open your Minizwerg map
            </Button> : null}
        >
            <Switch />
        </Form.Item>
    </>;
}