import React from 'react';
import { Menu, Button, Spin, Typography } from "antd";
import { DisconnectOutlined, DesktopOutlined } from '@ant-design/icons';
import { useLocation, matchPath, Link, useParams, useNavigate } from "react-router-dom";
import './style.less';

export function MapNav() {
    let { serverKey } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    let selectedKeys: string[] = [];

    if( matchPath( `/${serverKey}`, pathname ) )
        selectedKeys.push( 'map' );
    if( matchPath( `/${serverKey}/controls/frames`, pathname ) || matchPath( `/${serverKey}/controls/frames/:id`, pathname ) )
        selectedKeys.push( 'controls/frames' );
    if( matchPath( `/${serverKey}/controls/layout`, pathname ) )
        selectedKeys.push( 'controls/layout' );
    if( matchPath( `/${serverKey}/settings`, pathname ) )
        selectedKeys.push( 'settings' );

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test( navigator.userAgent );

    return (
        <Menu mode="horizontal" selectedKeys={selectedKeys}>
            <Menu.Item key='title' disabled style={{ cursor: 'default' }}>
                <Typography.Title className={'appTitle'}>RailroadsOnline Extended</Typography.Title>
                <Typography.Title className={'appTitleShort'}>RROx</Typography.Title>
            </Menu.Item>
            <Menu.Item key='attach' style={{ marginLeft: 'auto', cursor: 'default' }} disabled>
                <Button
                    className="disconnectButton"
                    shape="round"
                    onClick={() => {
                        navigate( '/' );
                    }}
                    icon={<DisconnectOutlined />}
                    >
                    Disconnect
                </Button>
            </Menu.Item>
            {!isMobile && <Menu.Item key='desktop' style={{ cursor: 'default' }} disabled>
                <Button
                    shape="round"
                    onClick={() => {
                        window.location.href = `rrox://${serverKey}`;
                    }}
                    icon={<DesktopOutlined />}
                    >
                    Open in desktop app
                </Button>
            </Menu.Item>}
            <Menu.Item key="map" >
                <Link to={`/${serverKey}`}>
                    Map
                </Link>
            </Menu.Item>
            <Menu.Item key="controls/frames" >
                <Link to={`/${serverKey}/controls/frames`}>
                    Rolling Stock
                </Link>
            </Menu.Item>
            <Menu.Item key="controls/layout" >
                <Link to={`/${serverKey}/controls/layout`}>
                    Layout Control
                </Link>
            </Menu.Item>
            <Menu.Item key="settings">
                <Link to={`/${serverKey}/settings`}>
                    Settings
                </Link>
            </Menu.Item>
        </Menu>
    );
}
