import React, { useContext, useEffect } from "react";
import { Button, Radio, Form, Switch, Input, Tooltip, Spin } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { AttachContext } from "../utils/attach";
import { AttachedState } from "@rrox/types";

export function AttachModal( { onCancel }: { onCancel: () => void } ) {
    const { setMode, mode, setShared, shared, setShareURL, shareURL, attach, detach, loading, status } = useContext( AttachContext );

    return <>
        <Radio.Group
            buttonStyle="solid"
            style={{ width: '100%', marginBottom: 25 }}
            className={( loading || status !== AttachedState.DETACHED ) ? 'attachButtonsDisabled' : undefined}
            value={mode}
            onChange={( e ) => ( loading || status !== AttachedState.DETACHED ) ? undefined : setMode( e.target.value, shareURL != null, shareURL )}
        >
            <Radio.Button value="host" style={{ width: '50%', textAlign: 'center' }}>Local</Radio.Button>
            <Radio.Button value="client" style={{ width: '50%', textAlign: 'center' }}>Remote</Radio.Button>
        </Radio.Group>
        {mode === 'host' &&
            <>
                <p>When attaching to the game, you can share your session. Sharing your session allows you and others to view and interact with the map on other devices.</p>
                <p>When using RROx in a multiplayer session, you can share the URL with other players, to let them access all features of RROx.</p>
                {status === AttachedState.DETACHED && <Form.Item label="Share">
                    <Switch checked={shared} onChange={( checked ) => setShared( checked )} />
                </Form.Item>}
                {status !== AttachedState.DETACHED && shared && <Form.Item label="Share URL">
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 32px)' }}
                            value={shareURL}
                            readOnly
                        />
                        <Tooltip title="Copy Share URL">
                            <Button
                                icon={<CopyOutlined />}
                                onClick={() => {
                                    navigator.clipboard.writeText( shareURL );
                                }}
                            />
                        </Tooltip>
                    </Input.Group>
                </Form.Item>}
            </>
        }
        {mode === 'client' &&
            <>
                <p>When using RROx in a multiplayer session, you can connect to the host using their shared URL. This enables all features of RROx for multiplayer clients.</p>
                <Form.Item label="URL">
                    <Input
                        value={shareURL}
                        onChange={( e ) => setShareURL( e.target.value )}
                        readOnly={loading || status !== AttachedState.DETACHED}
                    />
                </Form.Item>
            </>
        }
        {status === AttachedState.DETACHED && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Spin spinning={loading}>
                <Button style={{ marginRight: 10 }} onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={() => attach()}>Attach</Button>
            </Spin>
        </div>}
        {status !== AttachedState.DETACHED && <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onCancel}>Close</Button>
            {status === AttachedState.ATTACHED && <Button style={{ marginLeft: 10 }} type="primary" onClick={() => {
                detach();
                onCancel();
            }}>Detach</Button>}
        </div>}
    </>
}