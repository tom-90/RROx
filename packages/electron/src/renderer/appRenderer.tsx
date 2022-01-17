//import './wdyr';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { MapPage } from './pages/Map';
import { Settings } from './pages/Settings';
import { Info } from './pages/Info';
import './app.less';
import './components/DanglingInjector';
import { Modal, notification, Progress } from 'antd';
import './types';
import { AttachProvider } from './utils/attach';

window.mode = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? 'overlay' : 'normal';

if ( window.mode === 'overlay' )
    document.title = 'RROxOverlay';

// Render application in DOM
ReactDOM.render( <DraggableModalProvider>
    <AttachProvider>
        <MemoryRouter>
            <Routes>
                <Route path="/settings" element={<Settings />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/info" element={<Info />} />
                <Route path="/" element={<Navigate to="/map" />} />
            </Routes>
        </MemoryRouter>
    </AttachProvider>
</DraggableModalProvider>, document.getElementById( 'app' ) );

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();


if ( window.mode === 'normal' ) {
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

    let buildProgressModal: ReturnType<typeof Modal.info>;
    let buildTimeout: NodeJS.Timeout;
    window.ipc.on( 'build-progress', ( e, segmentNumber: number, totalSegmentCount: number ) => {
        if( !buildProgressModal && segmentNumber !== 0 && totalSegmentCount !== 0  ) {
            buildProgressModal = Modal.info( {
                title: 'Building...',
                icon: null,
                content: <BuildProgress />,
                maskClosable: false,
                mask: true,
                okButtonProps: { style: { display: 'none' } }
            } );
        } else if( segmentNumber === 0 && totalSegmentCount === 0 ) {
            buildProgressModal.destroy();
            buildProgressModal = null;
            clearTimeout( buildTimeout );
            buildTimeout = null;
        } else {
            if( buildTimeout )
                clearTimeout( buildTimeout );

            buildTimeout = setTimeout( () => {
                buildProgressModal.destroy();
                buildProgressModal = null;
                buildTimeout = null;
            }, 10000 );
        }
    } );
}

export function BuildProgress() {
    const [ progress, setProgress ] = useState( 0 );

    useEffect( () => {
        const dispose = window.ipc.on( 'build-progress', ( e, segmentNumber: number, totalSegmentCount: number ) => {
            setProgress( segmentNumber / totalSegmentCount );
        } );

        return () => {
            dispose();
        }
    }, [] );

    return <Progress percent={Math.ceil( progress * 100 )} />;
}