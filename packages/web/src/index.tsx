import * as React from "react";
import { render } from "react-dom";
import { MapPage } from "./Pages/MapPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import 'antd/dist/antd.less';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.scss';

const rootEl = document.getElementById("root");

render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/:serverKey" element={<MapPage />} />
        </Routes>
    </BrowserRouter>,
    rootEl
);