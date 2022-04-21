import { ContextRegistration, MenuButtonRegistration, RendererMode } from '@rrox/api';
import { CommunicatorContext, AttachedContextProvider, ModeContext, SettingsContext, RegistrationContext, ContextProvider, Routes } from '@rrox/renderer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, UpdateNotify } from './base';
import { RouterRegistration } from '@rrox/api';
import packageInfo from '../../package.json';
import { Router as MainRouter } from './components';
import { AppstoreAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { ShareMode, ShareModeCommunicator } from '../shared';

export const init = async ( manager: import( '@rrox/renderer/bootstrap' ).PluginManager ) => {
    const metadata = {
        plugin : packageInfo.name   ,
        version: packageInfo.version,
    };

    const mode = await manager.communicator.rpc( ShareModeCommunicator );

    manager.registrations.register( RouterRegistration, metadata, <MainRouter /> );

    if( mode !== ShareMode.CLIENT )
        manager.registrations.register( MenuButtonRegistration, metadata, 'Plugins', {
            icon  : <AppstoreAddOutlined />,
            linkTo: 'plugins'
        } ).setPriority( 50 );

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
    manager.registrations.register( ContextRegistration, metadata, <UpdateNotify /> );

    ReactDOM.render(
        <RegistrationContext.Provider value={manager.registrations}>
            <Router>
                <ContextProvider>
                    <Routes homeRoute='@rrox/electron/home' />
                </ContextProvider> 
            </Router>
        </RegistrationContext.Provider>,
        document.getElementById( 'app' )
    );

    const { PluginManagerMode } = ( await import( '@rrox/renderer/bootstrap' ) );

    if( mode === ShareMode.CLIENT )
        await manager.setMode( PluginManagerMode.Remote );

    manager.enable();
};