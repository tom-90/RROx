import React, { useState, useMemo } from 'react';
import { Divider, Form, Switch, Select, Slider, Button } from 'antd';
import { Modal, Input, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { PageLayout } from "../components/PageLayout";
import { BackgroundSettings, ColorSettings } from '@rrox/components';

export function Settings() {

    const [ form ] = Form.useForm();

    const [ settings, setSettings ] = useState( window.settingsStore.getAll() );

    const AutosaveSliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };
    const MapSliderMilliseconds = { 0: 500, 10: 1000, 20: 2000, 30: 3000, 40: 4000, 50: 5000, 70: 7000, 100: 30000 };
    
    const throttleOnValuesChange = useMemo( () => {
        let values = {};
        let timeout: NodeJS.Timeout = null;

        return ( changedValues: any, callback: ( changedValues: any ) => void ) => {
            values = { ...values, ...changedValues };

            if( timeout != null )
                clearTimeout( timeout );

            timeout = setTimeout( () => {
                callback( values );
                clearTimeout( timeout );
                timeout = null;
                values = {};
            }, 500 );
        };
    }, [] );

    const resetColor = ( ...keys: string[] ) => {
        keys.forEach( ( k ) => window.settingsStore.reset( k ) );
        form.setFieldsValue( window.settingsStore.getAll() );

        window.ipc.send( 'update-config' );
    };

    return (
        <PageLayout style={{ overflowY: 'auto' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: 20 }}>
                <Form
                    name="settings"
                    layout="vertical"
                    labelCol={{ span: 8, offset: 3 }}
                    wrapperCol={{ span: 16, offset: 3 }}
                    initialValues={settings}
                    form={form}
                    
                    onValuesChange={( changed ) => {
                        throttleOnValuesChange( changed, ( changedValues ) => {
                            for( let key in changedValues )
                                window.settingsStore.set( key, changedValues[ key ] );

                            setSettings( {
                                ...settings,
                                ...changedValues
                            } );

                            window.ipc.send( 'update-config' );
                        } );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Map</Divider>
                    <BackgroundSettings name="map.background" />
                    <Form.Item
                        label="Refresh Interval"
                        name="map.refresh"
                        help="Use this slider to adjust the map refresh time for optimized performance."
                        normalize={( sliderVal ) => {
                            return ( MapSliderMilliseconds as any )[ sliderVal ];
                        }}
                        getValueProps={( savedVal ) => {
                            return {
                                value: Object.entries( MapSliderMilliseconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
                            };
                        }}
                    >
                        <Slider style={{ marginLeft: 20 }} marks={{
                            0: '0.5s',
                            10: '1s',
                            20: '2s',
                            30: '3s',
                            40: '4s',
                            50: '5s',
                            70: '10s',
                            100: '30s',
                        }} step={null} tooltipVisible={false} included={false}/>
                    </Form.Item>
                    <Divider orientation="left">Minimap</Divider>
                    <Form.Item
                        label="Show Minimap"
                        name="minimap.enabled"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Enable Transparent Mode"
                        name="minimap.transparent"
                        valuePropName="checked"
                    >
                        <Switch disabled={!settings[ 'minimap.enabled' ]}/>
                    </Form.Item>
                    <Form.Item
                        label="Minimap Location"
                        name="minimap.corner"
                    >
                        <Select style={{ maxWidth: 300 }} disabled={!settings[ 'minimap.enabled' ]}>
                            <Select.Option value={1}>Top Left</Select.Option>
                            <Select.Option value={2}>Top Right</Select.Option>
                            <Select.Option value={3}>Bottom Left</Select.Option>
                            <Select.Option value={4}>Bottom Right</Select.Option>
                        </Select>
                    </Form.Item>
                    <Divider orientation="left">Autosave</Divider>
                    <Form.Item
                        label="Enable"
                        name="autosave.enabled"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="Slots"
                        name="autosave.slots"
                    >
                        <Select
                            style={{ maxWidth: 300 }}
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
                        name="autosave.interval"
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
                        }} step={null} tooltipVisible={false} included={false}/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="default"
                            disabled={!settings[ 'autosave.enabled' ]}
                            onClick={() => {
                                window.ipc.send( 'autosave' );
                            }}
                        >
                            Autosave now
                        </Button>
                    </Form.Item>
                    <Divider orientation="left">Colors</Divider>
                    <ColorSettings
                        resetToDefault={resetColor}
                        minizwergSharing={<tr>
                            <td>
                                <span>Share with Minizwerg:</span>
                            </td>
                            <td>
                                <Button
                                    type="default"
                                    className='minizwerg'
                                    onClick={() => {
                                        window.ipc.invoke( 'minizwerg-colors', true ).then( ( code ) => {
                                            if ( !code )
                                                return;
                                            Modal.info( {
                                                title: 'Share the following code with others:',
                                                icon: null,
                                                content: <Input.Group compact>
                                                    <Input
                                                        style={{ width: 'calc(100% - 50px)' }}
                                                        value={code}
                                                        readOnly
                                                    />
                                                    <Tooltip title="Copy Code">
                                                        <Button
                                                            icon={<CopyOutlined />}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText( code );
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Input.Group>
                                            } );
                                        } ).catch( ( e ) => {
                                            console.error( e );
                                        } );
                                    }}
                                >
                                    Share color scheme
                                </Button>
                            </td>
                            <td>
                                <Button
                                    type="default"
                                    className='minizwerg'
                                    onClick={() => {
                                        let code: string = '';
    
                                        Modal.confirm( {
                                            title: 'Enter the share code:',
                                            icon: null,
                                            content: <Input
                                                style={{ width: 'calc(100% - 50px)' }}
                                                onChange={( v ) => code = v.target.value}
                                            />,
                                            onOk: () => {
                                                window.ipc.invoke( 'minizwerg-colors', false, code ).then( () => {
                                                    form.setFieldsValue( window.settingsStore.getAll() );
                                                } ).catch( ( e ) => {
                                                    console.error( e );
                                                } );
                                            }
                                        } );
                                    }}
                                >
                                    Import color scheme
                                </Button>
                            </td>
                        </tr>}
                    />
                    <Divider orientation="left">Minizwerg</Divider>
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
                    <Divider orientation="left">Debugging</Divider>
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
                </Form>
            </div>
        </PageLayout>
    );
}