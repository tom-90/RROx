import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageLayout, PageContent } from "@rrox/base-ui";
import { Avatar, Badge, Button, Col, Dropdown, Input, List, Menu, message, Row, Space, Spin, Tabs } from "antd";
import { useCallbackDelayed } from "../../hooks";
import { DevPluginCommunicator, Log, PluginsCommunicator } from "../../../shared";
import { AppstoreOutlined, EllipsisOutlined, FileTextOutlined, UserOutlined } from "@ant-design/icons";
import { Plugin } from "./plugin";
import { useListener, useRPC } from "@rrox/api";
import { IPlugin } from "../../bootstrap/plugins";
import { searchRegistry } from "./verdaccio";

export function PluginsPage() {
    const { plugin } = useParams();
    const getInstalledPlugins = useRPC( PluginsCommunicator );
    const addDevPlugin = useRPC( DevPluginCommunicator );
    const [ installed, setInstalledPlugins ] = useState<IPlugin[] | null>();
    const [ plugins, setPlugins ] = useState<any[]>( [] );
    const [ selected, setSelected ] = useState<string | null>( plugin ? plugin : null );

    const onChange = useCallbackDelayed( ( e: string | React.ChangeEvent<HTMLInputElement> ) => {
        let value = typeof e === 'string' ? e : e.target.value;
        if( value === '' ) {
            setPlugins( [] );
            return;
        }

        searchRegistry( value ).then( async ( res ) => {
            if( !res.ok ) {
                Log.error( 'Failed to retrieve plugins from the plugin registry', res.status, res.statusText, await res.text() );
                message.error( 'Failed to retrieve plugins from the plugin registry.' );
                return;
            }

            setPlugins( await res.json() );
        } ).catch( ( e ) => {
            Log.error( 'Failed to retrieve plugins from the plugin registry', e );
            message.error( 'Failed to retrieve plugins from the plugin registry.' );
        } );
    }, 200, [] );

    useListener( PluginsCommunicator, ( installed ) => setInstalledPlugins( Object.values( installed ) ) );

    useEffect( () => {
        // To at least get an initial list of plugins,
        // we search for the @ symbol which all plugins have
        onChange( '@' );

        getInstalledPlugins().then( async ( [ installed ] ) => {
            setInstalledPlugins( Object.values( installed ) );
        } ).catch( ( e ) => {
            Log.error( 'Failed to get installed plugins', e );
            message.error( 'Failed to get installed plugins.' );
        } );
    }, [] );

    return <PageLayout>
        <PageContent>
            <Row style={{ height: '100%' }}>
                <Col span={8} style={{ height: '100%' }}>
                    <Tabs
                        defaultActiveKey="installed"
                        centered
                        onChange={() => setSelected( null )}
                        tabBarExtraContent={
                            <Dropdown
                                placement='bottomRight'
                                trigger={[ 'click' ]}
                                overlay={<Menu>
                                    <Menu.Item
                                        onClick={() => addDevPlugin()}
                                    >Add Development Plugin</Menu.Item>
                                </Menu>}
                            ><Button type='text'><EllipsisOutlined /></Button></Dropdown>
                        }
                    >
                        <Tabs.TabPane tab="Installed" key="installed">
                            <Spin spinning={installed == null}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={installed || []}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.name}
                                            style={{
                                                backgroundColor: selected === item.name ? '#fa8c164f' : undefined,
                                                padding: '10px 10px 1px 10px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setSelected( item.name )}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar style={{ backgroundColor: '#fa8c16' }} icon={<AppstoreOutlined />} />}
                                                title={item.description || item.name}
                                                description={<>
                                                    <Space style={{ marginRight: 5 }} key='author'><UserOutlined />{item.author}</Space>
                                                    <Space style={{ marginRight: 5 }} key='version'><FileTextOutlined />{'v' + item.version}</Space>
                                                    {item.dev ? <Badge
                                                        count='Development plugin'
                                                        style={{ marginTop: -5, backgroundColor: '#fa8c16' }}
                                                    /> : ( item.hasUpdate ? <Badge
                                                        count='Update available'
                                                        style={{ marginTop: -5, backgroundColor: '#fa8c16' }}
                                                    /> : <Badge
                                                        count='Installed'
                                                        style={{ marginTop: -5, backgroundColor: '#fa8c16' }}
                                                    /> )}
                                                </>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Available" key="available">
                            <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
                            <List
                                itemLayout="vertical"
                                dataSource={plugins}
                                renderItem={item => (
                                    <List.Item
                                        key={item._id}
                                        style={{
                                            backgroundColor: selected === item.name ? '#fa8c164f' : undefined,
                                            padding: '10px 10px 1px 10px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelected( item.name )}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: '#fa8c16' }} icon={<AppstoreOutlined />} />}
                                            title={item.description}
                                            description={<>
                                                <Space style={{ marginRight: 5 }} key='author'><UserOutlined />{item.author.name}</Space>
                                                <Space style={{ marginRight: 5 }} key='version'><FileTextOutlined />{'v' + item.version}</Space>
                                                {installed?.some( ( p ) => p.name === item.name ) && <Badge
                                                    count='Installed'
                                                    style={{ marginTop: -5, backgroundColor: '#fa8c16' }}
                                                />}
                                            </>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
                <Col span={16} style={{ height: '100%' }}>
                    <div style={{
                        margin: '5px 15px',
                        padding: '0 10px',
                        borderLeft: '1px solid #c7c7c7',
                        height: 'calc(100% - 20px)',
                        overflowY: 'auto',
                    }}>
                        {selected ? <Plugin
                            key={selected}
                            name={selected}
                            installed={installed?.find( ( i ) => i.name === selected )}
                        /> : null}
                    </div>
                </Col>
            </Row>
        </PageContent>
    </PageLayout>;
}