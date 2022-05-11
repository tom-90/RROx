import React, { useContext } from "react";
import { Pane } from "react-leaflet";
import { MapContext } from "../context";
import { Background } from "../elements";
import { Line } from "../leaflet";
import { MapMode } from "../types";

export function BackgroundPane() {
    const { config, mode, preferences } = useContext( MapContext )!;

    return <Pane name='background' style={{ zIndex: 0 }}>
        <Line
            positions={[
                config.map.bounds.getNorthWest(),
                config.map.bounds.getNorthEast(),
                config.map.bounds.getSouthEast(),
                config.map.bounds.getSouthWest(),
                config.map.bounds.getNorthWest(),
            ]}
            color={'black'}
            weight={1000}
            opacity={mode === MapMode.MINIMAP && preferences.minimap.transparent ? 0 : 1}
        />
        <Background />
    </Pane>;
}