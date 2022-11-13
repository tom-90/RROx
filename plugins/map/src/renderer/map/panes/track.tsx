import { useWorld } from '@rrox-plugins/world/renderer';
import { SplineTrackType, SplineType } from '@rrox-plugins/world/shared';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Splines, SplineTrackCross90 } from '../elements';
import { SplineTracks } from '../elements/splineTracks';

const SplineTrackTypes = [
    SplineTrackType.RAIL_WALL_3FT_01,
    SplineTrackType.RAIL_BALLAST_3FT_H01, SplineTrackType.RAIL_BALLAST_3FT_H05, SplineTrackType.BALLAST_H10,
    SplineTrackType.RAIL_3FT_SPAWN, SplineTrackType.RAIL_3FT, SplineTrackType.RAIL_3FT_ENGINEHOUSE,
    SplineTrackType.TRESTLE_3FT_WOOD_01, SplineTrackType.TRESTLE_3FT_PILE_01, SplineTrackType.TRESTLE_3FT_STEEL_01
];

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
                <SplineTracks
                    data={data?.splineTracks.filter( ( s ) => SplineTrackTypes.includes(s.type) ) ?? []}
                    type={SplineType.TRACK}
                />
                {data?.splineTracks.filter((s) => s.type === SplineTrackType.CROSS90_3FT).map((s, i) => 
                    <SplineTrackCross90
                        data={s} key={i}
                    />
                )}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}