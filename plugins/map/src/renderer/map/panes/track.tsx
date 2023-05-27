import { useWorld } from '@rrox-plugins/world/renderer';
import { SplineTrackType, SplineType } from '@rrox-plugins/world/shared';
import React from 'react';
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Splines, SplineTrackCross } from '../elements';
import { BumperStop } from '../elements/bumperStop';
import { SplineTracks } from '../elements/splineTracks';

const SplineTrackTypes = [
    SplineTrackType.RAIL_WALL_3FT_01,
    SplineTrackType.RAIL_BALLAST_3FT_H01, SplineTrackType.RAIL_BALLAST_3FT_H05, SplineTrackType.RAIL_BALLAST_3FT_H10,
    SplineTrackType.RAIL_3FT_SPAWN, SplineTrackType.RAIL_3FT, SplineTrackType.RAIL_3FT_ENGINEHOUSE, SplineTrackType.RAIL_3FT_COALINGTOWER,
    SplineTrackType.TRESTLE_3FT_WOOD_01, SplineTrackType.TRESTLE_3FT_PILE_01, SplineTrackType.TRESTLE_3FT_STEEL_01, SplineTrackType.BRIDGE_3FT_STEEL_TRUSS_01, 
    SplineTrackType.BUMPER
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
                    data={data?.splineTracks.filter( ( s ) => SplineTrackTypes.includes( s.type ) ) ?? []}
                    type={SplineType.TRACK}
                />
                {data?.splineTracks.filter( ( s ) => s.type === SplineTrackType.CROSS90_3FT ).map( ( s, i ) =>
                    <SplineTrackCross
                        data={s} key={i} degrees={90}
                    />
                )}
                {data?.splineTracks.filter( ( s ) => s.type === SplineTrackType.CROSS45_3FT ).map( ( s, i ) =>
                    <SplineTrackCross
                        data={s} key={i} degrees={-45}
                    />
                )}
                {data?.splineTracks.filter( ( s ) => s.type === SplineTrackType.BUMPER ).map( ( s, i ) =>
                    <BumperStop
                        data={s} key={i}
                    />
                )}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}