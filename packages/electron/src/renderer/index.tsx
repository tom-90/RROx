import { ContextRegistration, MenuButtonProps, MenuButtonRegistration, RendererMode } from '@rrox/api';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, RegistrationContext, ModeContext, CommunicatorContext, ContextProvider, SettingsContext, UpdateNotify, Routes } from './base';
import { RouterRegistration } from '@rrox/api';
import packageInfo from '../../package.json';
import { Router as MainRouter } from './components';
import { AppstoreAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { AttachedContextProvider } from './base/context/attached';

export const init = ( manager: import( './bootstrap/plugins' ).PluginManager ) => {
    const metadata = {
        plugin : packageInfo.name   ,
        version: packageInfo.version,
    };

    manager.registrations.register( RouterRegistration, metadata, <MainRouter /> );
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
                    <Routes />
                </ContextProvider> 
            </Router>
        </RegistrationContext.Provider>,
        document.getElementById( 'app' )
    );

    manager.enable();
};