import { useWorld } from '@rrox-plugins/world/renderer';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Industry } from '../elements';

export function IndustriesPane() {
    const data = useWorld();

    return <Pane name='industries' style={{ zIndex: 20 }}>
        <LayersControl.Overlay name="Industries" checked>
            <LayerGroup>
                {data?.industries.map( ( s, i ) => <Industry data={s} key={i} index={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}