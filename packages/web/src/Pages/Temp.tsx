import * as React from "react";

import { Gauge } from '../components/GaugeControl';

export function Temp() {
    return (
        <div className="page-container key-input-body">
            <Gauge type={2} value={50} max={280} key="hay-you" />
        </div>
    );
}