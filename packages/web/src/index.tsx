import * as React from "react";
import { render } from "react-dom";
import { MapPage } from "./Pages/MapPage";

import 'antd/dist/antd.less';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.scss';

const rootEl = document.getElementById("root");

render(<MapPage />, rootEl);