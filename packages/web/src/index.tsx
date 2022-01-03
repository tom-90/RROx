import * as React from "react";
import { render } from "react-dom";
import { MapPage } from "./Pages/MapPage";
import { EnterKey } from "./Pages/EnterKeyPage";
import { PlayerSelect } from "./Pages/PlayerSelect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { message } from "antd";

import 'antd/dist/antd.less';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.scss';

const rootEl = document.getElementById("root");

message.config({
    maxCount: 1
});

render(
    <DraggableModalProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EnterKey />} />
                <Route path="/:serverKey" element={<PlayerSelect />} />
                <Route path="/:serverKey/map" element={<MapPage />} />
            </Routes>
        </BrowserRouter>
    </DraggableModalProvider>,
    rootEl
);