import { useWorld } from '@rrox-plugins/world/renderer';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Frame } from '../elements';

export function FramesPane() {
    const data = useWorld();

    return <Pane name='frames' style={{ zIndex: 80 }}>
        <LayersControl.Overlay name="Locomotives and Carts" checked>
            <LayerGroup>
                {data?.frameCars.map( ( s, i ) => <Frame data={s} index={i} frames={data.frameCars} key={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}