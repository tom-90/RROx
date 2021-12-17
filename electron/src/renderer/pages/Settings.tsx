import React, { useMemo, useState } from 'react';
import { Divider, Form, Switch, Select, Slider, Button, Radio, Avatar } from 'antd';
import { PageLayout } from "../components/PageLayout";
import Store from 'electron-store';
import Background1 from "../../../assets/images/bg1.jpg";
import Background2 from "../../../assets/images/bg2.jpg";
import Background3 from "../../../assets/images/bg3.jpg";
import Background4 from "../../../assets/images/bg4.jpg";
import Background5 from "../../../assets/images/bg5.jpg";

declare global {
    interface Window {
        settingsStore: Store;
    }
}

export function Settings() {

    const [ settings, setSettings ] = useState( {
        mapBackground     : window.settingsStore.get( 'map.background'           ),
        showMinimap       : window.settingsStore.get( 'minimap.enabled'          ),
        transparentMinimap: window.settingsStore.get( 'minimap.transparent'      ),
        minimapCorner     : window.settingsStore.get( 'minimap.corner'           ),
        autosaveEnabled   : window.settingsStore.get( 'autosave.enabled'         ),
        autosaveSlots     : window.settingsStore.get( 'autosave.slots'           ),
        autosaveInterval  : window.settingsStore.get( 'autosave.interval'        ),
        minizwergUpload   : window.settingsStore.get( 'minizwerg.enabled'        ),
        minizwergPublic   : window.settingsStore.get( 'minizwerg.public'         ),
    } );

    const SliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };

    return (
        <PageLayout>
            <div style={{ maxWidth: 1000, width: '100%', overflowY: 'auto', marginBottom: 20 }}>
                <Form
                    name="settings"
                    layout="vertical"
                    labelCol={{ span: 8, offset: 3 }}
                    wrapperCol={{ span: 16, offset: 3 }}
                    initialValues={settings}
                    onValuesChange={( changedValues ) => {
                        if (changedValues.mapBackground !== undefined )
                            window.settingsStore.set( 'map.background', changedValues.mapBackground );
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
                        if( changedValues.minizwergUpload !== undefined )
                            window.settingsStore.set( 'minizwerg.enabled', changedValues.minizwergUpload );
                        if( changedValues.minizwergPublic !== undefined )
                            window.settingsStore.set( 'minizwerg.public', changedValues.minizwergPublic );
                        setSettings( {
                            ...settings,
                            ...changedValues,
                        } );
                        window.ipc.send( 'update-config' );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Map</Divider>
                     <Form.Item
                        label="Map Background"
                        name="mapBackground"
                    >
                        <Radio.Group>
                            <Radio.Button value={1} style={{ margin: '5px', padding: '5px', height: '100%'  }}><Avatar shape='square' size={128} src={Background1}/></Radio.Button>
                            <Radio.Button value={2} style={{ margin: '5px', padding: '5px', height: '100%'  }}><Avatar shape='square' size={128} src={Background2}/></Radio.Button>
                            <Radio.Button value={3} style={{ margin: '5px', padding: '5px', height: '100%'  }}><Avatar shape='square' size={128} src={Background3}/></Radio.Button>
                            <Radio.Button value={4} style={{ margin: '5px', padding: '5px', height: '100%'  }}><Avatar shape='square' size={128} src={Background4}/></Radio.Button>
                            <Radio.Button value={5} style={{ margin: '5px', padding: '5px', height: '100%'  }}><Avatar shape='square' size={128} src={Background5}/></Radio.Button>
                        </Radio.Group> 
                    </Form.Item>
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
                        <Button
                            type="default"
                            disabled={!settings.autosaveEnabled}
                            onClick={() => {
                                window.ipc.send( 'autosave' );
                            }}
                        >
                            Autosave now
                        </Button>
                    </Form.Item>
                    <Divider orientation="left">Minizwerg</Divider>
                    <Form.Item
                        label="Upload autosaves to Minizwerg"
                        name="minizwergUpload"
                        valuePropName="checked"
                        help={<p style={{ padding: '10px 0' }}>Uploading to Minizwerg happens at most every 15 minutes</p>}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Make Minizwerg saves public"
                        name="minizwergPublic"
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
                </Form>
            </div>
        </PageLayout>
    );
}