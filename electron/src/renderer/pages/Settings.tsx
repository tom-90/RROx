import React, { useMemo, useState } from 'react';
import { Divider, Form, Switch, Select, Slider, Button } from 'antd';
import { PageLayout } from "../components/PageLayout";
import Store from 'electron-store';

declare global {
    interface Window {
        settingsStore: Store;
    }
}

export function Settings() {

    const [ settings, setSettings ] = useState( {
        showMinimap       : window.settingsStore.get( 'minimap.enabled'     ),
        transparentMinimap: window.settingsStore.get( 'minimap.transparent' ),
        minimapCorner     : window.settingsStore.get( 'minimap.corner'      ),
        autosaveEnabled   : window.settingsStore.get( 'autosave.enabled'    ),
        autosaveSlots     : window.settingsStore.get( 'autosave.slots'      ),
        autosaveInterval  : window.settingsStore.get( 'autosave.interval'   ),
        keepOnTop         : window.settingsStore.get( 'keepOnTop'           ),
    } );

    const SliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };

    return (
        <PageLayout>
            <div style={{ maxWidth: 1000, width: '100%', overflowY: 'auto' }}>
                <Form
                    name="settings"
                    layout="vertical"
                    labelCol={{ span: 8, offset: 3 }}
                    wrapperCol={{ span: 16, offset: 3 }}
                    initialValues={settings}
                    onValuesChange={( changedValues ) => {
                        if( changedValues.showMinimap !== undefined )
                            window.settingsStore.set( 'minimap.enabled', changedValues.showMinimap );
                        if( changedValues.transparentMinimap !== undefined )
                            window.settingsStore.set( 'minimap.transparent', changedValues.transparentMinimap );
                        if( changedValues.minimapCorner !== undefined )
                            window.settingsStore.set( 'minimap.corner', changedValues.minimapCorner );
                        if( changedValues.autosaveEnabled !== undefined )
                            window.settingsStore.set( 'autosave.enabled', changedValues.autosaveEnabled );
                        if( changedValues.autosaveSlots !== undefined )
                            window.settingsStore.set( 'autosave.slots', changedValues.autosaveSlots );
                        if( changedValues.autosaveInterval !== undefined )
                            window.settingsStore.set( 'autosave.interval', changedValues.autosaveInterval );
                        if( changedValues.keepOnTop !== undefined )
                            window.settingsStore.set( 'keepOnTop', changedValues.keepOnTop );
                        setSettings( {
                            ...settings,
                            ...changedValues,
                        } );
                        window.ipc.send( 'update-config' );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Minimap</Divider>
                    <Form.Item
                        label="Show Minimap"
                        name="showMinimap"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Enable Transparent Mode"
                        name="transparentMinimap"
                        valuePropName="checked"
                    >
                        <Switch disabled={!settings.showMinimap}/>
                    </Form.Item>
                    <Form.Item
                        label="Minimap Location"
                        name="minimapCorner"
                    >
                        <Select style={{ maxWidth: 300 }} disabled={!settings.showMinimap}>
                            <Select.Option value={1}>Top Left</Select.Option>
                            <Select.Option value={2}>Top Right</Select.Option>
                            <Select.Option value={3}>Bottom Left</Select.Option>
                            <Select.Option value={4}>Bottom Right</Select.Option>
                        </Select>
                    </Form.Item>
                    <Divider orientation="left">Autosave</Divider>
                    <Form.Item
                        label="Enable"
                        name="autosaveEnabled"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Slots"
                        name="autosaveSlots"
                    >
                        <Select
                            style={{ maxWidth: 300 }}
                            disabled={!settings.autosaveEnabled}
                            mode={'multiple'}
                        >
                            <Select.Option value={1}>Slot 1</Select.Option>
                            <Select.Option value={2}>Slot 2</Select.Option>
                            <Select.Option value={3}>Slot 3</Select.Option>
                            <Select.Option value={4}>Slot 4</Select.Option>
                            <Select.Option value={5}>Slot 5</Select.Option>
                            <Select.Option value={6}>Slot 6</Select.Option>
                            <Select.Option value={7}>Slot 7</Select.Option>
                            <Select.Option value={8}>Slot 8</Select.Option>
                            <Select.Option value={9}>Slot 9</Select.Option>
                            <Select.Option value={10}>Slot 10</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Interval"
                        name="autosaveInterval"
                        normalize={( sliderVal ) => {
                            return ( SliderSeconds as any )[ sliderVal ];
                        }}
                        getValueProps={( savedVal ) => {
                            return {
                                value: Object.entries( SliderSeconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                            };
                        }}
                    >
                        <Slider style={{ marginLeft: 20 }} disabled={!settings.autosaveEnabled} marks={{
                            0: '10s',
                            7: '30s',
                            15: '1m',
                            23: '2m',
                            35: '5m',
                            50: '10m',
                            65: '15m',
                            80: '20m',
                            100: '30m',
                        }} step={null} tooltipVisible={false} included={false}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" disabled={!settings.autosaveEnabled} onClick={() => {
                            window.ipc.send( 'autosave' );
                        }}>
                            Autosave now
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </PageLayout>
    );
}