import { useWorld } from "@rrox-plugins/world/renderer";
import React from "react";
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { WaterTower } from "../elements";

export function WatertowersPane() {
    const data = useWorld();

    return <Pane name='watertowers' style={{ zIndex: 40 }}>
        <LayersControl.Overlay name="Watertowers" checked>
            <LayerGroup>
                {data?.watertowers.map( ( s, i ) => <WaterTower data={s} key={i} index={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}