import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContent, PageLayout } from "@rrox/base-ui";
import AppIcon from "../appIcon.ico";
import { Button, Typography, Form, Input, Tooltip, message, Modal, Avatar } from "antd";
import { LoginOutlined, GlobalOutlined, DesktopOutlined } from "@ant-design/icons";
import './style.less';
import { SocketCommunicatorContext } from "../context";

export function HomePage() {
    const [ keyInput, setKeyInput ] = useState('');
    const navigate = useNavigate();
    const [ isConnected, setConnected ] = useState( false );
    const communicator = useContext( SocketCommunicatorContext );

    useEffect( () => {
        if( !communicator )
            return;

        const destroy = communicator.whenAvailable( () => {
            setConnected( true );
        } );

        return () => destroy();
    }, [ communicator ] );


    const onEnterKey = useCallback( () => {
        let key = keyInput.replace( 'https://rrox.tom90.nl/key/', '' );

        if( !key )
            return message.error('Key can not be empty');

        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test( navigator.userAgent ) )
            return navigate( `/key/${key}` );

        const instance = Modal.confirm( {
            title            : 'Open mode',
            content          : <div className="key-enter-dialog">
                <p>How do you want to open this map? You can either view this map in the browser, or open it in the RROx app that you have downloaded <a href="https://tom-90.github.io/RROx/">here</a>.</p>
                <table>
                    <tbody>
                        <tr>
                            <td onClick={() => {
                                instance.destroy();
                                window.location.href = `rrox://key/${key}`;
                            }}>
                                <Avatar
                                    shape="square"
                                    size={100}
                                    icon={<DesktopOutlined />}
                                />
                            </td>
                            <td onClick={() => {
                                instance.destroy();
                                navigate( `/key/${key}` );
                            }}>
                                <Avatar
                                    shape="square"
                                    size={100}
                                    icon={<GlobalOutlined />}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>In the RROx app</strong></td>
                            <td><strong>In the browser</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>,
            icon             : null,
            okButtonProps    : { style: { display: 'none' } }, 
            cancelButtonProps: { style: { display: 'none' } },
            maskClosable     : true,
            closable         : true,
        } );
    }, [ keyInput ] );

    return <PageLayout>
        <PageContent style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <img width={100} src={AppIcon} />
                <Typography.Title style={{ fontWeight: 'bold', textAlign: 'center' }}>RailroadsOnline Extended</Typography.Title>
            </div>
    	    <p>
                RailroadsOnline Extended provides an in-game minimap, with the ability to remotely control switches and locomotives.
                In addition, RROx allows you to teleport to various locations and trigger autosaves.
            </p>
            <p>
                This is the web version of RROx, where you can enter a URL to connect to a shared session. More information about RROx can be found <a target="_blank" href="https://tom-90.github.io/RROx/">here</a>.
            </p>
            {isConnected
                    ? <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Button onClick={() => communicator?.disconnect()}>Disconnect</Button>
                    </div>
                    : <Form.Item>
                        <Input.Group compact>
                            <Input
                                value={keyInput}
                                placeholder={"Please enter the shared URL"}
                                onChange={( e ) => setKeyInput( e.target.value )}
                                onPressEnter={onEnterKey}
                                required
                                style={{ width: 'calc(100% - 50px)' }}
                            />
                            <Tooltip title="Open Map">
                                <Button
                                    icon={<LoginOutlined />}
                                    onClick={onEnterKey}
                                    type="primary"
                                />
                            </Tooltip>
                        </Input.Group>
                    </Form.Item>
            }
        </PageContent>
    </PageLayout>;
}