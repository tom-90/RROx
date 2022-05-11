import { useWorld } from '@rrox-plugins/world/renderer';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Turntable } from '../elements';

export function TurntablesPane() {
    const data = useWorld();

    return <Pane name='turntables' style={{ zIndex: 60 }}>
        <LayersControl.Overlay name="Turntables" checked>
            <LayerGroup>
                {data?.turntables.map( ( s, i ) => <Turntable data={s} key={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}