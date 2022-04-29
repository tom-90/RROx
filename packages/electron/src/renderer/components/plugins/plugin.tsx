import { FileTextOutlined, GithubOutlined, UserOutlined } from "@ant-design/icons";
import { Theme, useLazyStyles, useRPC } from "@rrox/api";
import { IPlugin } from "@rrox/renderer/bootstrap";
import { Button, message, Modal, PageHeader, Space, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { InstallPluginCommunicator, Log, RestartCommunicator, UninstallPluginCommunicator, UpdatePluginCommunicator } from "../../../shared";
import { getPackage, getReadme } from "./verdaccio";
import PluginsDark from './plugins.dark.lazy.less';
import PluginsLight from './plugins.light.lazy.less';

function openLoadingModal( text: string ) {
    return Modal.info( {
        title: text,
        content: <div style={{ marginTop: 50, marginRight: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spin tip={text}/>
        </div>,
        closable: false,
        width: 500,
        okButtonProps: { style: { display: 'none' } },
    } );
}

export function Plugin( { name, installed }: { name: string, installed?: IPlugin } ) {
    useLazyStyles( {
        [ Theme.DARK  ]: PluginsDark,
        [ Theme.LIGHT ]: PluginsLight,
    } );

    const [ readme, setReadme ] = useState( '' );
    const [ data, setData ] = useState<any>( null );

    const installPlugin = useRPC( InstallPluginCommunicator );
    const uninstallPlugin = useRPC( UninstallPluginCommunicator );
    const updatePlugin = useRPC( UpdatePluginCommunicator );
    const restartRROx = useRPC( RestartCommunicator );

    useEffect( () => {
        getReadme( name ).then( async ( res ) => {
            if( !res.ok ) {
                Log.error( 'Failed to retrieve plugin README from the plugin registry', res.status, res.statusText, await res.text() );
                message.error( 'Failed to retrieve plugin README from the plugin registry.' );
                return;
            }

            setReadme( await res.text() );
        } ).catch( ( e ) => {
            Log.error( 'Failed to retrieve plugin README from the plugin registry', e );
            message.error( 'Failed to retrieve plugin README from the plugin registry.' );
        } );
    }, [] );

    useEffect( () => {
        getPackage( name ).then( async ( res ) => {
            if( !res.ok ) {
                Log.error( 'Failed to retrieve plugin data from the plugin registry', res.status, res.statusText, await res.text() );
                message.error( 'Failed to retrieve plugin data from the plugin registry.' );
                return;
            }

            setData( await res.json() );
        } ).catch( ( e ) => {
            Log.error( 'Failed to retrieve plugin data from the plugin registry', e );
            message.error( 'Failed to retrieve plugin data from the plugin registry.' );
        } );
    }, [] );
    
    const install = useCallback( ( confirm = false ) => {
        const loading = openLoadingModal( 'Installing...' );

        installPlugin( name, confirm ).then( ( res ) => {
            if( !res ) {
                loading.destroy();
                message.success( 'Plugin was succesfully installed.' );
                return;
            }

            loading.update( {
                title: `Installing ${data?.description || name}:`,
                content: <span style={{ whiteSpace: 'pre-line'}}>{res}</span>,
                closable: true,
                maskClosable: true,
                okText: 'Confirm',
                okButtonProps: {},
                onOk: () => {
                    loading.destroy();
                    install( true );
                },
                onCancel: () => {
                    loading.destroy();
                },
            } );
        } ).catch( ( e ) => {
            loading.destroy();
            Log.error( 'Failed to install plugin.', e );
            message.error( 'Failed to install plugin.' );
        } );
    }, [ installPlugin, name, data ] );
    
    const uninstall = useCallback( ( confirm = false ) => {
        const loading = openLoadingModal( 'Uninstalling...' );

        uninstallPlugin( name, confirm ).then( ( res ) => {
            if( !res ) {
                loading.update( {
                    title: 'Restart required',
                    content: 'RROx needs to be restarted for the changes te apply.',
                    closable: false,
                    maskClosable: false,
                    cancelText: undefined,
                    okButtonProps: {},
                    okText: 'Restart',
                    onOk: () => restartRROx(),
                } );
                return;
            }

            loading.update( {
                title: `Uninstalling ${data?.description || name}:`,
                content: <span style={{ whiteSpace: 'pre-line'}}>{res}</span>,
                closable: true,
                maskClosable: true,
                okText: 'Confirm',
                okButtonProps: {},
                onOk: () => {
                    loading.destroy();
                    uninstall( true );
                },
                onCancel: () => {
                    loading.destroy();
                },
            } );
        } ).catch( ( e ) => {
            loading.destroy();
            Log.error( 'Failed to uninstall plugin.', e );
            message.error( 'Failed to uninstall plugin.' );
        } );
    }, [ uninstallPlugin, name, data ] );
    
    const update = useCallback( ( confirm = false ) => {
        const loading = openLoadingModal( 'Updating...' );

        updatePlugin( name, confirm ).then( ( res ) => {
            if( !res ) {
                loading.update( {
                    title: 'Restart required',
                    content: 'RROx needs to be restarted for the changes te apply.',
                    closable: false,
                    maskClosable: false,
                    cancelText: undefined,
                    okButtonProps: {},
                    okText: 'Restart',
                    onOk: () => restartRROx(),
                } );
                return;
            }

            loading.update( {
                title: `Updating ${data?.description || name}:`,
                content: <span style={{ whiteSpace: 'pre-line'}}>{res}</span>,
                closable: true,
                maskClosable: true,
                okText: 'Confirm',
                okButtonProps: {},
                onOk: () => {
                    loading.destroy();
                    uninstall( true );
                },
                onCancel: () => {
                    loading.destroy();
                },
            } );
        } ).catch( ( e ) => {
            Log.error( 'Failed to update plugin.', e );
            message.error( 'Failed to update plugin.' );
        } );
    }, [ updatePlugin, name, data ] );

    return <>
        <PageHeader
            title={data?.latest.description}
            subTitle={name}
            extra={[
                installed == null ? <Button key="install" type="primary" onClick={() => install()}>
                    Install
                </Button> : <Button key="uninstall" onClick={() => uninstall()}>
                    Uninstall
                </Button>,
                installed != null && installed.hasUpdate ? <Button key="update" type="primary"  onClick={() => update()}>
                    Update
                </Button> : null,
            ]}
        >
            {data && <>
                <Space style={{ marginRight: 5 }} key='author'><UserOutlined /><strong>Author:</strong>{data.latest.author.name}</Space>
                <Space style={{ marginRight: 5 }} key='version'><FileTextOutlined /><strong>Latest version:</strong>{'v' + data.latest.version}</Space>
                <Space style={{ marginRight: 5 }} key='repo'><GithubOutlined /><a href={data.latest.repository.url}>Source Code</a></Space>
            </>}
        </PageHeader>
        <div className='markdown-body' style={{ padding: '0 24px' }} dangerouslySetInnerHTML={{ __html: readme }}/>
    </>;
}