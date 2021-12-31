import * as React from "react";
import { render } from "react-dom";
import { MapPage } from "./Pages/MapPage";

import 'antd/dist/antd.css';
import 'leaflet/dist/leaflet.css';
import './assets/scss/App.css';

const rootEl = document.getElementById("root");

render(<MapPage />, rootEl);