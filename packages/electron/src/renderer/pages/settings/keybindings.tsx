import { Form, FormInstance } from 'antd';
import React from 'react';
import { KeybindInput } from '../../components/KeybindInput';

export function KeybindingsSettings( {}: { settings: any, form: FormInstance } ) {
    return <>
        <Form.Item
            label="Open Map"
            name="keybind.openMap"
        >
            <KeybindInput />
        </Form.Item>
        <Form.Item
            label="Autosave Now"
            name="keybind.autosave"
        >
            <KeybindInput />
        </Form.Item>
    </>;
}