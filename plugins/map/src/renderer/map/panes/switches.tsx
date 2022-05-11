import { useWorld } from '@rrox-plugins/world/renderer';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Switch } from '../elements';

export function SwitchesPane() {
    const data = useWorld();

    return <Pane name='switches' style={{ zIndex: 70 }}>
        <LayersControl.Overlay name="Switches" checked>
            <LayerGroup>
                {data?.switches.map( ( s, i ) => <Switch data={s} index={i} key={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}