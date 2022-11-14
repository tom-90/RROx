import { useWorld } from '@rrox-plugins/world/renderer';
import { SplineTrackType } from '@rrox-plugins/world/shared';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { SplineTrackSwitch, Switch } from '../elements';

const SplineTrackSwitches = [  
    SplineTrackType.SWITCH_3FT_LEFT, SplineTrackType.SWITCH_3FT_LEFT_MIRROR,
    SplineTrackType.SWITCH_3FT_RIGHT, SplineTrackType.SWITCH_3FT_RIGHT_MIRROR,
    SplineTrackType.SWITCH_BALLAST_3FT_LEFT, SplineTrackType.SWITCH_BALLAST_3FT_LEFT_MIRROR,
    SplineTrackType.SWITCH_BALLAST_3FT_RIGHT, SplineTrackType.SWITCH_BALLAST_3FT_RIGHT_MIRROR,
];

export function SwitchesPane() {
    const data = useWorld();

    return <Pane name='switches' style={{ zIndex: 70 }}>
        <LayersControl.Overlay name="Switches" checked>
            <LayerGroup>
                {data?.switches.map( ( s, i ) => <Switch data={s} index={i} key={i} /> ) ?? []}
                {data?.splineTracks
                    .map((s, i) => [s, i] as const)
                    .filter(([s]) => SplineTrackSwitches.includes(s.type))
                    .map(([s, i]) => <SplineTrackSwitch data={s} index={i} key={i} clickable />) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}