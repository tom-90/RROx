import React, { useCallback, useEffect, useState } from "react";
import { PageContent, PageLayout } from "@rrox/base-ui";
import AppIcon from "@rrox/assets/images/appIcon.ico";
import { Button, Divider, Spin, Steps, Typography, Form, Tooltip, Input, Switch, Tabs, message, Modal } from "antd";
import { AppstoreOutlined, CheckCircleOutlined, FileSearchOutlined, LoginOutlined, LoadingOutlined, CopyOutlined } from "@ant-design/icons";
import { AttachCommunicator, AttachedCommunicator, AttachStatus, DetachCommunicator, ShareConnectClientCommunicator, ShareConnectHostCommunicator, ShareKeysCommunicator, ShareMode, ShareModeCommunicator } from "../../shared";
import { useRPC, useValue } from "@rrox/api";

function Step( { step, currentStatus, icon, last, ...restProps }: {
    step: AttachStatus,
    currentStatus: AttachStatus,
    title: string,
    description?: string,
    last?: boolean,
    icon: React.ReactElement
} ) {
    return <Steps.Step
        {...restProps}
        status={currentStatus > step || ( currentStatus === step && last ) ? 'finish' : ( currentStatus === step ? 'process' : 'wait')}
        icon={currentStatus === step && !last ? <LoadingOutlined /> : icon}
    />;
}

export function HomePage() {
    const attach = useRPC( AttachCommunicator );
    const detach = useRPC( DetachCommunicator );
    const status = useValue( AttachedCommunicator );
    const attachStatus = useValue( AttachedCommunicator );
    const shareMode = useValue( ShareModeCommunicator );
    const shareKeys = useValue( ShareKeysCommunicator, {} );
    const connectHost = useRPC( ShareConnectHostCommunicator );
    const connectClient = useRPC( ShareConnectClientCommunicator );

    const [ keyInput, setKeyInput ] = useState( '' );
    const [ loadingShared, setLoadingShared ] = useState( false );

    useEffect( () => {
        if( loadingShared )
            setLoadingShared( false );
    }, [ shareMode ] );

    const onEnterKey = useCallback( () => {
        let key = keyInput.replace( 'https://rrox.tom90.nl/key/', '' );

        if( !key )
            return message.error( 'Key can not be empty' );

        const modal = Modal.confirm( {
            title: 'Reload required',
            content: 'In order to load all plugins that are activated by the host, RROx will now reload.',
            onOk: () => {
                connectClient( key ).catch( ( e ) => {
                    modal.destroy();
                    message.error( 'Failed to connect to host.' );
                } );
            },
        } );
    }, [ keyInput ] );

    return <PageLayout>
        <PageContent style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <img width={100} src={AppIcon} />
                <Typography.Title style={{ fontWeight: 'bold', color: '#303030', textAlign: 'center' }}>RailroadsOnline Extended</Typography.Title>
            </div>
    	    <p>
                RailroadsOnline Extended provides an in-game minimap, with the ability to remotely control switches and locomotives.
                In addition, RROx allows you to teleport to various locations and trigger autosaves.
            </p>
            <p>
                RROx attaches to the game using <a href={'https://wikipedia.org/wiki/DLL_injection'}>DLL injection</a>.
                This means that no game files are modified on disk. By closing RROx and restarting the game, the game will run completely unaffected.
                To start using RROx, click the attach button below.
            </p>
            <Tabs centered activeKey={shareMode === ShareMode.CLIENT ? 'remote' : ( shareMode === ShareMode.HOST ? 'local' : undefined)}>
                <Tabs.TabPane key='local' tab='Local' disabled={shareMode === ShareMode.CLIENT}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '5px 0 20px 0' }}>
                        {status === AttachStatus.DETACHED && <Button type='primary' onClick={() => attach()}>Attach</Button>}
                        {[ AttachStatus.INITIALIZING, AttachStatus.INJECTING, AttachStatus.LOADING_PLUGINS ].includes( status )
                            && <Spin><Button type='primary' disabled onClick={() => attach()}>Attach</Button></Spin>}
                        {status === AttachStatus.ATTACHED && <Button onClick={() => detach()}>Detach</Button>}
                    </div>
                    <Steps style={{ padding: '20px 30px' }}>
                        <Step currentStatus={status} step={AttachStatus.INJECTING} title='Attach' description="Inject RROx into the game" icon={<LoginOutlined />} />
                        <Step currentStatus={status} step={AttachStatus.INITIALIZING} title="Initialize" description="Analyze game memory" icon={<FileSearchOutlined />} />
                        <Step currentStatus={status} step={AttachStatus.LOADING_PLUGINS} title="Plugins" description="Load RROx plugins" icon={<AppstoreOutlined />} />
                        <Step currentStatus={status} step={AttachStatus.ATTACHED} title="Done" icon={<CheckCircleOutlined />} last />
                    </Steps>
                    <Divider
                        orientation="left"
                        style={{ margin: '20px 0', borderTopColor: 'rgba(0,0,0,0.2)' }}
                    >Share session</Divider>
                    <p>
                        Sharing your session allows you and others to view and interact with RROx on other devices.
                        When using RROx in a multiplayer session, you can share the URL with other players, to let them access all features of RROx.
                    </p>
                    <p>
                        RROx creates two different types of URLs. A private URL allows others to interact with RROx regularly.
                        A public URL allows players only to view your map.
                    </p>
                    <Form
                        name="sharing"
                        labelCol={{ span: 4, offset: 0 }}
                        wrapperCol={{ span: 12, offset: 0 }}
                        autoComplete="off"
                    >
                        <Form.Item label="Share">
                            <Spin spinning={loadingShared}>
                                <Switch checked={shareMode === ShareMode.HOST} onChange={( checked ) => {
                                    connectHost( checked );
                                    setLoadingShared( true );
                                }} />
                            </Spin>
                        </Form.Item>
                        <Form.Item label="Private URL">
                            <Input.Group compact>
                                <Input
                                    style={{ width: 'calc(100% - 32px)' }}
                                    value={shareKeys.private}
                                    readOnly
                                    disabled={shareKeys.private == null}
                                />
                                <Tooltip title="Copy Private URL">
                                    <Button
                                        icon={<CopyOutlined />}
                                        disabled={shareKeys.private == null}
                                        onClick={() => {
                                            if( shareKeys.private )
                                                navigator.clipboard.writeText( shareKeys.private );
                                        }}
                                    />
                                </Tooltip>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item label="Public URL">
                            <Input.Group compact>
                                <Input
                                    style={{ width: 'calc(100% - 32px)' }}
                                    value={shareKeys.public}
                                    readOnly
                                    disabled={shareKeys.public == null}
                                />
                                <Tooltip title="Copy Public URL">
                                    <Button
                                        icon={<CopyOutlined />}
                                        disabled={shareKeys.public == null}
                                        onClick={() => {
                                            if( shareKeys.public )
                                                navigator.clipboard.writeText( shareKeys.public );
                                        }}
                                    />
                                </Tooltip>
                            </Input.Group>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane key='remote' tab='Remote' disabled={shareMode === ShareMode.HOST || (shareMode !== ShareMode.CLIENT && attachStatus === AttachStatus.ATTACHED)}>   
                    <p>
                        When using RROx in a multiplayer session, you can connect to the host using their shared URL.
                        It is possible to connect via a public URL in which case you will not be able to perform any actions, and only view certain things like the map.
                        Using a private URL it is possible to use most of the features of RROx.
                    </p>
                    {shareMode === ShareMode.CLIENT 
                        ? <div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Button onClick={() => connectClient( null )}>Disconnect</Button>
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
                </Tabs.TabPane>
            </Tabs>
        </PageContent>
    </PageLayout>;
}