//import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MapPage } from './pages/Map';
import { Settings } from './pages/Settings';
import { Info } from './pages/Info';
import './app.less';
import './components/DanglingInjector';

window.mode = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? 'overlay' : 'normal';

if ( window.mode === 'overlay' )
    document.title = 'RROxOverlay';

// Render application in DOM
ReactDOM.render( <MemoryRouter>
    <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/info" element={<Info />} />
        <Route path="/" element={<Navigate to="/map" />} />
    </Routes>
</MemoryRouter>, document.getElementById( 'app' ) );

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();
