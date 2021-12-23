import React, { useState } from 'react';
import { Divider, Form, Switch, Select, Slider, Button, Radio, Avatar, Modal, Input, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { PageLayout } from "../components/PageLayout";
import Background1 from "../../../assets/images/bg1.jpg";
import Background2 from "../../../assets/images/bg2.jpg";
import Background3 from "../../../assets/images/bg3.jpg";
import Background4 from "../../../assets/images/bg4.jpg";
import Background5 from "../../../assets/images/bg5.jpg";
import FlatcarLogs from '../../../assets/images/cars/flatcar_logs.png';
import FlatcarCordwood from '../../../assets/images/cars/flatcar_cordwood.png';
import FlatcarStakes from '../../../assets/images/cars/flatcar_stakes.png';
import Hopper from '../../../assets/images/cars/flatcar_hopper.png';
import Tanker from '../../../assets/images/cars/flatcar_tanker.png';
import Boxcar from '../../../assets/images/cars/boxcar.png';
import Caboose from '../../../assets/images/cars/caboose.png';
import { Cars } from '../../shared/cars';

export function Settings() {

    const [ form ] = Form.useForm();

    const [ settings, setSettings ] = useState( window.settingsStore.getAll() );

    const SliderSeconds = { 0: 10, 7: 30, 15: 60, 23: 120, 35: 300, 50: 600, 65: 900, 80: 1200, 100: 1800 };

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
                    
                    onValuesChange={( changedValues ) => {
                        for( let key in changedValues )
                            window.settingsStore.set( key, changedValues[ key ] );

                        setSettings( {
                            ...settings,
                            ...changedValues
                        } );

                        window.ipc.send( 'update-config' );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Map</Divider>
                     <Form.Item
                        label="Map Background"
                        name="map.background"
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
                            return ( SliderSeconds as any )[ sliderVal ];
                        }}
                        getValueProps={( savedVal ) => {
                            return {
                                value: Object.entries( SliderSeconds ).find( ( [ mark, seconds ] ) => seconds === savedVal )?.[ 0 ]
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
                    <Divider orientation="left">Cart Colors</Divider>
                    <table className='colorTable'>
                        <thead>
                            <tr>
                                <th>Cart</th>
                                <th>Unloaded</th>
                                <th>Loaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><img src={FlatcarLogs}/></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_LOGS}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_LOGS}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={FlatcarCordwood} /></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_CORDWOOD}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_CORDWOOD}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={FlatcarStakes} /></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_STAKES}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.FLATCAR_STAKES}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={Hopper} /></td>
                                <td><Form.Item name={`colors.${Cars.HOPPER}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.HOPPER}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={Tanker} /></td>
                                <td><Form.Item name={`colors.${Cars.TANKER}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.TANKER}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={Boxcar} /></td>
                                <td><Form.Item name={`colors.${Cars.BOXCAR}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.BOXCAR}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td><img src={Caboose} /></td>
                                <td><Form.Item name={`colors.${Cars.CABOOSE}.unloaded`}><input type='color' /></Form.Item></td>
                                <td><Form.Item name={`colors.${Cars.CABOOSE}.loaded`}><input type='color' /></Form.Item></td>
                            </tr>
                            <tr>
                                <td>
                                    <span>Share with Minizwerg:</span>
                                </td>
                                <td>
                                    <Button
                                        type="default"
                                        onClick={() => {
                                            window.ipc.invoke( 'minizwerg-colors', true ).then( ( code ) => {
                                                if( !code )
                                                    return;
                                                Modal.info({
                                                    title  : 'Share the following code with others:',
                                                    icon   : null,
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
                            </tr>
                        </tbody>
                    </table>
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
                </Form>
            </div>
        </PageLayout>
    );
}