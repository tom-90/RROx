import { useWorld } from "@rrox-plugins/world/renderer";
import { SplineType } from "@rrox-plugins/world/shared";
import React from "react";
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Splines } from "../elements";

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
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}