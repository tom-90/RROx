import * as React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { Input, Button, message, Tooltip, Form, Modal, Avatar } from "antd";
import { LoginOutlined, DesktopOutlined, GlobalOutlined } from "@ant-design/icons";

export function EnterKey() {
    const [keyInput, setKeyInput] = useState('');
    const navigate = useNavigate();

    const OpenMapPage = () => {
        let key = keyInput.replace( 'https://rrox.tom90.nl/', '' );

        if( !key )
            return message.error('Key can not be empty');

        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test( navigator.userAgent ) )
            return navigate( `/${key}` );

        const instance = Modal.confirm( {
            title            : 'Open mode',
            content          : <div className="openDialog">
                <p>How do you want to open this map? You can either view this map in the browser, or open it in the RROx app that you have downloaded <a href="https://tom-90.github.io/RROx/">here</a>.</p>
                <table>
                    <tbody>
                        <tr>
                            <td onClick={() => {
                                instance.destroy();
                                window.location.href = `rrox://${key}`;
                            }}>
                                <Avatar
                                    shape="square"
                                    size={100}
                                    icon={<DesktopOutlined />}
                                />
                            </td>
                            <td onClick={() => {
                                instance.destroy();
                                navigate( `/${key}` );
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
    };

    return (
        <div className="page-container key-input-body">
            <div className="key-input-div">
                <div className="key-input-container">
                    <h1>Railroads Online Extended</h1>
                    <p>
                        Railroads Online Extended provides an in-game minimap, with the ability to remotely control switches and locomotives.
                        In addition, RROx allows you to teleport to various locations and trigger autosaves.
                        More information about RROx can be found <a href="https://tom-90.github.io/RROx/">on this page</a>.
                    </p>
                    <p>
                        On this site, you can enter a shared URL to view and interact with a RailroadsOnline-map remotely.
                    </p>
                    <Form.Item>
                        <Input.Group compact>
                            <Input
                                value={keyInput}
                                placeholder={"Please enter the shared URL"}
                                onChange={( e ) => setKeyInput( e.target.value )}
                                onPressEnter={OpenMapPage}
                                required
                                style={{ width: 'calc(100% - 50px)' }}
                            />
                            <Tooltip title="Open Map">
                                <Button
                                    icon={<LoginOutlined />}
                                    onClick={OpenMapPage}
                                    type="primary"
                                />
                            </Tooltip>
                        </Input.Group>
                    </Form.Item>
                </div>
            </div>
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}