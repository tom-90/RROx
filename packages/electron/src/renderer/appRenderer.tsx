//import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { MapPage } from './pages/Map';
import { Settings } from './pages/Settings';
import { Info } from './pages/Info';
import './app.less';
import '@rrox/assets/css/DarkMode.scss';
import './components/DanglingInjector';
import { Modal, notification } from 'antd';
import './types';
import { AttachProvider } from './utils/attach';
import { MapDataProvider } from './hooks/useMapData';
import { RollingStockPage } from './pages/RollingStock';
import { RollingStockControlsPage } from './pages/RollingStockControls';

window.mode = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? 'overlay' : 'normal';

if ( window.mode === 'overlay' )
    document.title = 'RROxOverlay';

// Render application in DOM
ReactDOM.render( <DraggableModalProvider>
    <AttachProvider>
        <MapDataProvider>
            <MemoryRouter>
                <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/controls/:id" element={<RollingStockControlsPage />} />
                    <Route path="/controls" element={<RollingStockPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/" element={<Navigate to="/map" />} />
                </Routes>
            </MemoryRouter>
        </MapDataProvider>
    </AttachProvider>
</DraggableModalProvider>, document.getElementById( 'app' ) );

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();


if ( window.mode === 'normal' ) {
    document.body.setAttribute('data-theme', window.settingsStore.get( 'site.darkMode' ) ? 'dark' : 'light');

    window.ipc.on( 'popup-message', ( event, type: 'warn' | 'info' | 'error', title: string, description: string ) => {
        if ( type === 'warn' )
            notification.warn( {
                message: title,
                description,
                placement: 'bottomRight',
                duration: 10,
            } );
        else if ( type === 'info' )
            notification.info( {
                message: title,
                description,
                placement: 'bottomRight',
                duration: 10,
            } );
        else if ( type === 'error' )
            notification.error( {
                message: title,
                description,
                placement: 'bottomRight',
                duration: 10,
            } );
    } );

    if( !window.settingsStore.get( 'install-message-shown' ) ) {
        window.settingsStore.set( 'install-message-shown', true );
        Modal.info( {
            title: 'RROx was installed sucessfully',
            width: 420,
            maskClosable: true,
            content: <>
                <p>A shortcut has been added to your desktop and start-menu which you can use to open RROx.</p>
                <p>Please use <a
                    onClick={() => window.openBrowser( 'https://discord.gg/vPxGPCDFBp' )}
                >this Discord server</a> to get info about RROx or ask for help if you encounter any issues.</p>
            </>,
            cancelButtonProps: { style: { display: 'none' } },
        } );
    }
}