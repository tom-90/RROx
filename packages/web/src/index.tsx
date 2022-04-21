import { ContextRegistration, MenuButtonRegistration, RendererMode, useCommunicatorAvailable } from '@rrox/api';
import { CommunicatorContext, AttachedContextProvider, ModeContext, SettingsContext, RegistrationContext, ContextProvider, Routes } from '@rrox/renderer';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import { Route, useParams, useNavigate } from 'react-router-dom';
import { RouterRegistration } from '@rrox/api';
import packageInfo from '../package.json';
import { Router as MainRouter } from './components';
import { AppstoreAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Router } from './base';
import { ErrorPage, PageContent, PageLayout } from '@rrox/base-ui';

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
    manager.registrations.register( ContextRegistration, metadata, <ModeContext.Provider value={RendererMode.WINDOW} /> );
    manager.registrations.register( ContextRegistration, metadata, <SettingsContext.Provider value={manager.settings} /> );

    const communicator = manager.communicator as import( './communicator' ).SocketCommunicator;

    const OnKeyEnter = function() {
        const { key } = useParams();
        const available = useCommunicatorAvailable();
        const navigate = useNavigate();

        if( !key )
            return <ErrorPage
                title='Invalid key'
                message='The session key that was provided is invalid.'
            />;

        useEffect( () => {
            if( !available )
                communicator.connect( key );
            else {
                manager.enable();
                navigate( '/@rrox/web/home' );
            }
        }, [ available ] );

        return <PageLayout>
            <PageContent>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin tip='Connecting...' />
                </div>
            </PageContent>
        </PageLayout>;
    };

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

    await manager.setMode( PluginManagerMode.Remote );

    manager.enable();
};