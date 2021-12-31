//import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { MapPage } from './pages/Map';
import { MapNewPage } from './pages/MapNew';
import { Settings } from './pages/Settings';
import { Info } from './pages/Info';
import './app.less';
import './components/DanglingInjector';
import { notification } from 'antd';

window.mode = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? 'overlay' : 'normal';

if ( window.mode === 'overlay' )
    document.title = 'RROxOverlay';

// Render application in DOM
ReactDOM.render( <DraggableModalProvider>
    <MemoryRouter>
        <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/mapNew" element={<MapNewPage />} />
            <Route path="/info" element={<Info />} />
            <Route path="/" element={<Navigate to="/mapNew" />} />
        </Routes>
    </MemoryRouter>
</DraggableModalProvider>, document.getElementById( 'app' ) );

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();


if ( window.mode === 'normal' )
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
    