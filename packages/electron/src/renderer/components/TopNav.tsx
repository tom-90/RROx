import React, {useContext, useState} from 'react';
import { Menu, Button, Spin, Typography, Modal } from "antd";
import { ApiOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, matchPath, Link } from "react-router-dom";
import { AttachModal } from './AttachModal';
import { AttachContext } from "../utils/attach";

export function TopNav() {
    const [ modal, contextHolder ] = Modal.useModal();
    const { pathname } = useLocation();

    const { status, progress, detach } = useContext( AttachContext );

    let selectedKeys: string[] = [];

    if( matchPath( '/map', pathname ) )
        selectedKeys.push( 'map' );
    if( matchPath( '/settings', pathname ) )
        selectedKeys.push( 'settings' );
    if( matchPath( '/controls', pathname ) )
        selectedKeys.push( 'controls' );
    if( matchPath( '/controls/:id', pathname ) )
        selectedKeys.push( 'controls' );
    if( matchPath( '/info', pathname ) )
        selectedKeys.push( 'info' );
    
    const attachBtnBackground = () => {
        if  (window.settingsStore.get('site.darkMode')){
            return status === 'ATTACHING' || status === 'DETACHING' ? `linear-gradient(90deg, rgba(250,140,22,0.2) 0%, rgba(250,140,22,0.2) ${progress}%, #2e2e2e ${progress}%)` : undefined;
        }else{
            return status === 'ATTACHING' || status === 'DETACHING' ? `linear-gradient(90deg, rgba(250,140,22,0.2) 0%, rgba(250,140,22,0.2) ${progress}%, rgba(0,0,0,0) ${progress}%)` : undefined;
        }
    }

    return (
        <Menu mode="horizontal" selectedKeys={selectedKeys}>
            <Menu.Item key='title' disabled style={{ cursor: 'default' }}>
                <Typography.Title className={'appTitle'}>RailroadsOnline Extended</Typography.Title>
                <Typography.Title className={'appTitleShort'}>RROx</Typography.Title>
            </Menu.Item>
            <Menu.Item key='attach' style={{ marginLeft: 'auto', cursor: 'default' }} disabled>
                <Button
                    shape="round"
                    className={
                        status === 'ATTACHING' || status === 'DETACHING' ? 'processingButton' 
                        : (status === 'ATTACHED' ? 'attachOptionsButton' : 'attachButton' )
                    }
                    onClick={() => {
                        if( status === 'ATTACHING' || status === 'DETACHING' )
                            return;
                        if( status === 'ATTACHED' ) {
                            const instance = modal.confirm( {
                                title            : 'Attach options',
                                content          : <AttachModal onCancel={() => instance.destroy()} />,
                                icon             : null,
                                okButtonProps    : { style: { display: 'none' } }, 
                                cancelButtonProps: { style: { display: 'none' } },
                            } );
                        }
                        if( status === 'DETACHED' ) {
                            const instance = modal.confirm( {
                                title            : 'Attach options',
                                content          : <AttachModal onCancel={() => instance.destroy()} />,
                                icon             : null,
                                okButtonProps    : { style: { display: 'none' } }, 
                                cancelButtonProps: { style: { display: 'none' } },
                            } );
                        }
                    }}
                    icon={
                        status === 'ATTACHING' || status === 'DETACHING' ? <Spin size="small" style={{ marginRight: 10 }}/>
                        : (status === 'ATTACHED' ? <SettingOutlined /> : <ApiOutlined /> )
                    }
                    style={{
                        background: attachBtnBackground()
                    }}
                    >
                    {status === 'ATTACHED'
                            ? 'Options'
                            : ( status === 'DETACHED'
                            ? 'Attach'
                            : ( status === 'ATTACHING'
                            ? 'Attaching...'
                            : ( status === 'DETACHING'
                            ? 'Detaching...' : 'Unknown' ) ) )}
                </Button>
                {contextHolder}
            </Menu.Item>
            <Menu.Item key="map" >
                <Link to="/map">
                    Map
                </Link>
            </Menu.Item>
            <Menu.Item key="controls">
                <Link to="/controls">
                    Rolling Stock
                </Link>
            </Menu.Item>
            <Menu.Item key="settings">
                <Link to="/settings">
                    Settings
                </Link>
            </Menu.Item>
            <Menu.Item key="info" style={{ marginRight: 30 }}>
                <Link to="/info">
                    Info
                </Link>
            </Menu.Item>
        </Menu>
    );
}
