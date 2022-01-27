import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import { message } from "antd";
import { App } from './app';

import './antd.less';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.scss';
import { SocketProvider } from "./helpers/socket";
import { MapDataProvider } from "./helpers/mapData";
import { SettingsProvider } from "./helpers/settings";

const rootEl = document.getElementById("root");

message.config({
    maxCount: 1
});

render(
    <DraggableModalProvider>
        <BrowserRouter>
            <SocketProvider>
                <MapDataProvider>
                    <SettingsProvider>
                        <App />
                    </SettingsProvider>
                </MapDataProvider>
            </SocketProvider>
        </BrowserRouter>
    </DraggableModalProvider>,
    rootEl
);

// Hot module replacement
if ( process.env.NODE_ENV == 'development' && module.hot ) module.hot.accept();