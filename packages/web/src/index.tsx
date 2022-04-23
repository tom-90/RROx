import { ContextRegistration, MenuButtonRegistration, RendererMode, useCommunicatorAvailable, OverlayMode, useSettings } from '@rrox/api';
import { CommunicatorContext, AttachedContextProvider, ModeContext, SettingsContext, RegistrationContext, ContextProvider, Routes, BaseRendererSettings } from '@rrox/renderer';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Spin, message, Modal, Input } from 'antd';
import { Route, useParams, useNavigate } from 'react-router-dom';
import { RouterRegistration } from '@rrox/api';
import packageInfo from '../package.json';
import { Router as MainRouter } from './components';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Router } from './base';
import { ErrorPage, PageContent, PageLayout } from '@rrox/base-ui';
import { SocketCommunicatorContext } from './context';

export const init = async ( manager: import( '@rrox/renderer/bootstrap' ).PluginManager ) => {
    const metadata = {
        plugin : "@rrox/web",
        version: packageInfo.version,
    };

    manager.registrations.register( RouterRegistration, metadata, <MainRouter /> );
    manager.registrations.register( MenuButtonRegistration, metadata, 'Settings', {
        icon  : <SettingOutlined />,
        linkTo: 'settings'
    } ).setPriority( 40 );
    manager.registrations.register( MenuButtonRegistration, metadata, 'Home', {
        icon  : <HomeOutlined />,
        linkTo: 'home'
    } ).setPriority( 500 );

    manager.registrations.register( ContextRegistration, metadata, <CommunicatorContext.Provider value={manager.communicator} /> );
    manager.registrations.register( ContextRegistration, metadata, <AttachedContextProvider /> );
    manager.registrations.register( ContextRegistration, metadata, <ModeContext.Provider value={{ overlay: OverlayMode.HIDDEN, renderer: RendererMode.WEB }} /> );
    manager.registrations.register( ContextRegistration, metadata, <SettingsContext.Provider value={manager.settings} /> );

    const communicator = manager.communicator as import( './communicator' ).SocketCommunicator;

    manager.registrations.register( ContextRegistration, metadata, <SocketCommunicatorContext.Provider value={communicator} />)

    const OnKeyEnter = function() {
        const { key } = useParams();
        const available = useCommunicatorAvailable();
        const navigate = useNavigate();
        const [ settings, store ] = useSettings( BaseRendererSettings );
        const [ error, setError ] = useState( false );

        useEffect( () => {
            if( !key )
                return;

            if( !settings[ 'player-name' ] ) {
                let playerName = '';

                function onOk() {
                    if( !playerName ) {
                        message.error( 'Please enter a valid player name.' );
                        return;
                    }

                    modal.destroy();

                    store.set( 'player-name', playerName );
                }

                const modal = Modal.info( {
                    title: 'Enter your player name',
                    content: <>
                        <p>To use RROx, please enter your player name:</p>
                        <Input
                            placeholder='Steam Player Name'
                            onChange={( e ) => playerName = e.target.value}
                            onPressEnter={onOk}
                        />
                    </>,
                    okButtonProps: { onClick: onOk },
                    closable: false,
                    maskClosable: false,
                })
                return;
            }

            if( !available && !error )
                communicator.connect( key )
                    .catch( ( e ) => {
                        console.error( e );
                        setError( true );
                    } );
            else {
                manager.enable();
                navigate( '/@rrox/web/home' );
            }
        }, [ available, key, settings[ 'player-name' ] ] );

        if( !key || error )
            return <ErrorPage
                title='Invalid key'
                message='The session key that was provided is invalid.'
            />;

        return <PageLayout>
            <PageContent>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin tip='Connecting...' />
                </div>
            </PageContent>
        </PageLayout>;
    };

    if( window.location.search === '?disconnected' ) {
        message.warn( 'Connection to the host was lost.' );
        history.replaceState( {}, 'RROx', '/@rrox/web/home' );
    }

    ReactDOM.render(
        <RegistrationContext.Provider value={manager.registrations}>
            <Router>
                <ContextProvider>
                    <Routes homeRoute='@rrox/web/home'>
                        <Route path="/key/:key" element={<OnKeyEnter />} />
                    </Routes>
                </ContextProvider> 
            </Router>
        </RegistrationContext.Provider>,
        document.getElementById( 'app' )
    );

    const { PluginManagerMode } = ( await import( '@rrox/renderer/bootstrap' ) );

    await manager.setManagerMode( PluginManagerMode.Remote );

    manager.enable();
};