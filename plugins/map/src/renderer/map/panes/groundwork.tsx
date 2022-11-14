import { useWorld } from "@rrox-plugins/world/renderer";
import { SplineTrackType, SplineType } from "@rrox-plugins/world/shared";
import React from "react";
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Splines, SplineTrackSwitch } from "../elements";
import { SplineTracks } from "../elements/splineTracks";

const SplineTrackToSpline = {
    [SplineType.CONSTANT_WALL]: [SplineTrackType.WALL_01, SplineTrackType.RAIL_WALL_3FT_01],
    [SplineType.CONSTANT_BANK]: [
        SplineTrackType.BALLAST_H01, SplineTrackType.BALLAST_H05, SplineTrackType.BALLAST_H10,
        SplineTrackType.RAIL_BALLAST_3FT_H01, SplineTrackType.RAIL_BALLAST_3FT_H05, SplineTrackType.RAIL_BALLAST_3FT_H10,
        SplineTrackType.RAIL_3FT_SPAWN
    ],
    [SplineType.WOODEN_BRIDGE]: [SplineTrackType.TRESTLE_3FT_WOOD_01, SplineTrackType.TRESTLE_3FT_PILE_01],
    [SplineType.IRON_BRIDGE]: [SplineTrackType.TRESTLE_3FT_STEEL_01],
};

const SplineTrackSwitchesToSpline = {
    [SplineTrackType.SWITCH_BALLAST_3FT_LEFT]: SplineType.CONSTANT_BANK,
    [SplineTrackType.SWITCH_BALLAST_3FT_LEFT_MIRROR]: SplineType.CONSTANT_BANK,
    [SplineTrackType.SWITCH_BALLAST_3FT_RIGHT]: SplineType.CONSTANT_BANK,
    [SplineTrackType.SWITCH_BALLAST_3FT_RIGHT_MIRROR]: SplineType.CONSTANT_BANK,
};

export function GroundworkPane() {
    const data = useWorld();

    return <Pane name='groundwork' style={{ zIndex: 10 }}>
        <LayersControl.Overlay name="Groundwork" checked>
            <LayerGroup>
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.CONSTANT_BANK ) ?? []}
                    type={SplineType.CONSTANT_BANK}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.VARIABLE_BANK ) ?? []}
                    type={SplineType.VARIABLE_BANK}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.CONSTANT_WALL ) ?? []}
                    type={SplineType.CONSTANT_WALL}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.VARIABLE_WALL ) ?? []}
                    type={SplineType.VARIABLE_WALL}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.WOODEN_BRIDGE ) ?? []}
                    type={SplineType.WOODEN_BRIDGE}
                />
                <Splines
                    data={data?.splines.filter( ( s ) => s.type === SplineType.IRON_BRIDGE ) ?? []}
                    type={SplineType.IRON_BRIDGE}
                />
                <SplineTracks
                    data={data?.splineTracks.filter(( s ) => SplineTrackToSpline[SplineType.CONSTANT_WALL].includes(s.type)) ?? []}
                    type={SplineType.CONSTANT_WALL}
                />
                <SplineTracks
                    data={data?.splineTracks.filter(( s ) => SplineTrackToSpline[SplineType.CONSTANT_BANK].includes(s.type)) ?? []}
                    type={SplineType.CONSTANT_BANK}
                />
                {data?.splineTracks
                    .map((s, i) => [s, i] as const)
                    .filter(([s]) => s.type in SplineTrackSwitchesToSpline)
                    .map(([s, i]) => <SplineTrackSwitch data={s} index={i} key={i} type={SplineTrackSwitchesToSpline[s.type as keyof typeof SplineTrackSwitchesToSpline]} />) ?? []}
                <SplineTracks
                    data={data?.splineTracks.filter(( s ) => SplineTrackToSpline[SplineType.WOODEN_BRIDGE].includes(s.type)) ?? []}
                    type={SplineType.WOODEN_BRIDGE}
                />
                <SplineTracks
                    data={data?.splineTracks.filter(( s ) => SplineTrackToSpline[SplineType.IRON_BRIDGE].includes(s.type)) ?? []}
                    type={SplineType.IRON_BRIDGE}
                />
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}