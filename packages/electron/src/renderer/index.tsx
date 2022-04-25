import { ContextRegistration, MenuButtonRegistration, RendererMode, SettingsRegistration } from '@rrox/api';
import { CommunicatorContext, AttachedContextProvider, SettingsContext, RegistrationContext, ContextProvider, Routes, KeybindsContext, ThemeProvider, RendererSettings } from '@rrox/renderer';
import React from 'react';
import ReactDOM from 'react-dom';
import { KeybindsController, ModeContext, Router, UpdateNotify } from './base';
import { RouterRegistration, ShareMode } from '@rrox/api';
import packageInfo from '../../package.json';
import { OverlaySettings, Router as MainRouter } from './components';
import { AppstoreAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { ShareModeCommunicator } from '../shared';

export const init = async ( manager: import( '@rrox/renderer/bootstrap' ).PluginManager ) => {
    const metadata = {
        plugin : packageInfo.name   ,
        version: packageInfo.version,
    };

    const shareMode = await manager.communicator.rpc( ShareModeCommunicator );

    manager.setShareMode( shareMode );

    manager.registrations.register( RouterRegistration, metadata, <MainRouter /> );

    if( shareMode !== ShareMode.CLIENT )
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

    manager.registrations.register( SettingsRegistration, metadata, {
        category: [ 'General' ],
        element : <RendererSettings />
    } );

    manager.registrations.register( SettingsRegistration, metadata, {
        category: [ 'Overlay' ],
        element : <OverlaySettings />
    } );
    
    manager.registrations.register( ContextRegistration, metadata, <CommunicatorContext.Provider value={manager.communicator} /> );
    manager.registrations.register( ContextRegistration, metadata, <AttachedContextProvider /> );
    manager.registrations.register( ContextRegistration, metadata, <ModeContext rendererMode={manager.rendererMode} /> );
    manager.registrations.register( ContextRegistration, metadata, <SettingsContext.Provider value={manager.settings} /> );
    manager.registrations.register( ContextRegistration, metadata, <ThemeProvider /> );
    manager.registrations.register( ContextRegistration, metadata, <KeybindsContext.Provider value={new KeybindsController( manager.communicator )} /> );
    manager.registrations.register( ContextRegistration, metadata, <UpdateNotify /> );

    ReactDOM.render(
        <RegistrationContext.Provider value={manager.registrations}>
            <Router>
                <ContextProvider>
                    <Routes homeRoute={manager.rendererMode === RendererMode.OVERLAY ? '@rrox/electron/overlay' : '@rrox/electron/home'} />
                </ContextProvider> 
            </Router>
        </RegistrationContext.Provider>,
        document.getElementById( 'app' )
    );

    const { PluginManagerMode } = ( await import( '@rrox/renderer/bootstrap' ) );

    if( shareMode === ShareMode.CLIENT )
        await manager.setManagerMode( PluginManagerMode.Remote );

    manager.enable();
};