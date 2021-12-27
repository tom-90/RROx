import React, { useState, useEffect } from 'react';
import { Menu, Button, Spin, Typography, notification, Modal } from "antd";
import { ApiOutlined, DisconnectOutlined } from '@ant-design/icons';
import { useLocation, matchPath, Link } from "react-router-dom";
import { AttachedState } from '../../shared/state';

export function TopNav() {
    const [ { status, progress }, setStatus ] = useState<{ status?: AttachedState, progress?: number }>( {} );
    const { pathname } = useLocation();

    useEffect( () => {
        let currentStatus = status;
        const setAttached = (
            event: Electron.IpcRendererEvent,
            status: AttachedState,
            progress?: number,
            error?: string
        ) => {
            setStatus( { status, progress } );
            if( status === AttachedState.DETACHED && currentStatus === AttachedState.ATTACHING ) {
                if( !error )
                    notification.warn( {
                        message: 'Attaching failed',
                        description: 'Make sure your antivirus is not blocking the program and that the game is running.',
                        placement: 'bottomRight'
                    } );
                else {
                    Modal.error( {
                        title: 'Attaching failed',
                        content: <p>
                            Attaching has failed with the following error code:
                            <code style={{
                                display: 'block',
                                textAlign: 'center',
                                margin: '5px 0',
                                fontWeight: 'bold'
                            }}>{error}</code>
                            Details on how to fix this code can be found here:
                            <br/>
                            <a href="https://tom-90.github.io/RROx/error-codes">https://tom-90.github.io/RROx/error-codes</a>
                        </p>,
                    } );
                }
            }
            currentStatus = status;
        };

        let cleanup = window.ipc.on( 'get-attached-state', setAttached );
        window.ipc.invoke( 'get-attached-state' ).then( ( status ) => setStatus( { status } ) );

        return () => {
            cleanup();
        }
    }, [] );

    let selectedKeys: string[] = [];

    if( matchPath( '/map', pathname ) )
        selectedKeys.push( 'map' );
    if( matchPath( '/settings', pathname ) )
        selectedKeys.push( 'settings' );
    if( matchPath( '/info', pathname ) )
        selectedKeys.push( 'info' );

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
                        : (status === 'ATTACHED' ? 'detachButton' : 'attachButton' )
                    }
                    onClick={() => {
                        if( status === 'ATTACHING' || status === 'DETACHING' )
                            return;
                        if( status === 'ATTACHED' )
                            return window.ipc.send( 'set-attached-state', 'DETACH' );
                        if( status === 'DETACHED' ) {
                            Modal.confirm( {
                                title  : 'Before attaching',
                                content: 'Make sure you have joined the game before attaching. Detach before leaving the game and before closing RROx.',
                                onOk() {
                                    window.ipc.send( 'set-attached-state', 'ATTACH' );
                                },
                                okText   : 'Attach',
                                cancelText: 'Cancel',
                            } );
                        }
                    }}
                    icon={
                        status === 'ATTACHING' || status === 'DETACHING' ? <Spin size="small" style={{ marginRight: 10 }}/>
                        : (status === 'ATTACHED' ? <DisconnectOutlined /> : <ApiOutlined /> )
                    }
                    style={{
                        background: status === 'ATTACHING' || status === 'DETACHING' ? `linear-gradient(90deg, rgba(250,140,22,0.2) 0%, rgba(250,140,22,0.2) ${progress}%, rgba(0,0,0,0) ${progress}%)` : undefined
                    }}
                >
                    {status === 'ATTACHED'
                            ? 'Detach'
                            : ( status === 'DETACHED'
                            ? 'Attach'
                            : ( status === 'ATTACHING'
                            ? 'Attaching...'
                            : ( status === 'DETACHING'
                            ? 'Detaching...' : 'Unknown' ) ) )}
                </Button>
            </Menu.Item>
            <Menu.Item key="map" >
                <Link to="/map">
                    Map
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
