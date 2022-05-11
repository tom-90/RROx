import { useWorld } from '@rrox-plugins/world/renderer';
import { SplineType } from '@rrox-plugins/world/shared';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Splines } from '../elements';

export function TrackPane() {
    const data = useWorld();

    return <Pane name='track' style={{ zIndex: 50 }}>
        <LayersControl.Overlay name="Tracks" checked>
            <LayerGroup>
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.TRACK ) ?? []}
                    type={SplineType.TRACK}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.TRENDLE_TRACK ) ?? []}
                    type={SplineType.TRENDLE_TRACK}
                />
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}