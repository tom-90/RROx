import * as React from "react";
import { render } from "react-dom";
import { MapPage } from "./Pages/MapPage";
import { EnterKey } from "./Pages/EnterKeyPage";
import { PlayerSelect } from "./Pages/PlayerSelect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { message } from "antd";

import './antd.less';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.scss';
import { SocketProvider } from "./helpers/socket";
import { MapDataProvider } from "./helpers/mapData";
import { SettingsProvider } from "./helpers/settings";
import { MapSettings } from "./Pages/MapSettings";
import { ControlsPage } from "./Pages/ControlsPage";
import { ControlPage } from "./Pages/ControlPage";

const rootEl = document.getElementById("root");

message.config({
    maxCount: 1
});

render(
    <DraggableModalProvider>
        <SocketProvider>
            <MapDataProvider>
                <SettingsProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<EnterKey />} />
                            <Route path="/:serverKey" element={<MapPage />} />
                            <Route path="/:serverKey/players" element={<PlayerSelect />} />
                            <Route path="/:serverKey/settings" element={<MapSettings />} />
                            <Route path="/:serverKey/controls" element={<ControlsPage />} />
                            <Route path="/:serverKey/controls/:id" element={<ControlPage />} />
                        </Routes>
                    </BrowserRouter>
                </SettingsProvider>
            </MapDataProvider>
        </SocketProvider>
    </DraggableModalProvider>,
    rootEl
);

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();