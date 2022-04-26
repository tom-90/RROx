import React, { useEffect } from "react";
import { Form, Switch, Select, Slider, Button } from "antd";
import { useRPC, useSettings } from "@rrox/api";
import { AutosaveCommunicator, AutosaveSettings } from "../../shared";
import { OpenSaveFolderCommunicator } from "../../shared/communicators/saveFolder";

export function AutosavesSettings() {
    const [ settings, store ] = useSettings( AutosaveSettings );
    const [ form ] = Form.useForm();
    const autosaveNow = useRPC( AutosaveCommunicator );
    const openSaveFolder = useRPC( OpenSaveFolderCommunicator );

    useEffect( () => {
        form.setFieldsValue( settings );
    }, [ settings ] );

    const AutosaveSliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };

    return <Form
        name="settings"
        layout="vertical"
        form={form}
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => store.setAll( changed )}
        autoComplete="off"
    >
        <Form.Item
            label="Enable"
            name={[ 'autosave', 'enabled' ]}
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        <Form.Item
            label="Slots"
            name={[ 'autosave', 'slots' ]}
        >
            <Select
                style={{ maxWidth: 300 }}
                mode={'multiple'}
            >
                <Select.Option value={'slot1'}>Save Slot 1</Select.Option>
                <Select.Option value={'slot2'}>Save Slot 2</Select.Option>
                <Select.Option value={'slot3'}>Save Slot 3</Select.Option>
                <Select.Option value={'slot4'}>Save Slot 4</Select.Option>
                <Select.Option value={'slot5'}>Save Slot 5</Select.Option>
                <Select.Option value={'slot6'}>Save Slot 6</Select.Option>
                <Select.Option value={'slot7'}>Save Slot 7</Select.Option>
                <Select.Option value={'slot8'}>Save Slot 8</Select.Option>
                <Select.Option value={'slot9'}>Save Slot 9</Select.Option>
                <Select.Option value={'slot10'}>Save Slot 10</Select.Option>
                <Select.Option value={'backup1'}>Backup Slot 1</Select.Option>
                <Select.Option value={'backup2'}>Backup Slot 2</Select.Option>
                <Select.Option value={'backup3'}>Backup Slot 3</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item
            help={<p style={{ padding: '10px 0', marginTop: -45 }}>
                Choose one or more save slots to use for autosaves. When selecting multiple slots, RROx will cycle through them.
                It is recommended to choose multiple slots in case a save is corrupted. The backup slots will not appear in game,
                but will appear in the <a onClick={() => openSaveFolder()}>save game folder</a>.
            </p>}
        />
        <Form.Item
            label="Interval"
            name={[ 'autosave', 'interval' ]}
            normalize={( sliderVal ) => {
                return ( AutosaveSliderSeconds as any )[ sliderVal ];
            }}
            getValueProps={( savedVal ) => {
                return {
                    value: Object.entries( AutosaveSliderSeconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                };
            }}
        >
            <Slider style={{ marginLeft: 20 }} marks={{
                0: '10s',
                7: '30s',
                15: '1m',
                23: '2m',
                35: '5m',
                50: '10m',
                65: '15m',
                80: '20m',
                100: '30m',
            }} step={null} tooltipVisible={false} included={false} />
        </Form.Item>
        <Form.Item>
            <Button
                type="default"
                disabled={!settings.autosave.enabled}
                onClick={() => autosaveNow()}
            >
                Autosave now
            </Button>
        </Form.Item>
    </Form>;
}