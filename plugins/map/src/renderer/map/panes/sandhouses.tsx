import { useWorld } from '@rrox-plugins/world/renderer';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Sandhouse } from '../elements';

export function SandhousesPane() {
    const data = useWorld();

    return <Pane name='sandhouses' style={{ zIndex: 30 }}>
        <LayersControl.Overlay name="Sandhouses" checked>
            <LayerGroup>
                {data?.sandhouses.map( ( s, i ) => <Sandhouse data={s} key={i} index={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}