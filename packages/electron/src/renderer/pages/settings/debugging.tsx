import { Button, Form, FormInstance, Switch } from 'antd';
import React from 'react';

export function DebuggingSettings( {}: { settings: any, form: FormInstance } ) {
    return <>
        <Form.Item
            label="Enable debug logging"
            name="loglevel"
            valuePropName="checked"
            getValueProps={( val ) => ( { checked: val === 'debug' } )}
            getValueFromEvent={( val ) => val ? 'debug' : 'info'}
            help={<>
                <p style={{ padding: '10px 0' }}>
                    This option allows RROx developers to better diagnose your issues.
                    You should not change it, unless you have been asked to by a developer.
                </p>
                <Button onClick={() => window.ipc.send( 'open-log' )}>
                    Open Log file
                </Button>
            </>}
        >
            <Switch />
        </Form.Item>
    </>;
}