import { useWorld } from "@rrox-plugins/world/renderer";
import React from "react";
import { LayerGroup, LayersControl, Pane } from "react-leaflet";
import { Player } from "../elements";

export function PlayersPane() {
    const data = useWorld();

    return <Pane name='players' style={{ zIndex: 90 }}>
        <LayersControl.Overlay name="Players" checked>
            <LayerGroup>
                {data?.players.map( ( s, i ) => <Player data={s} index={i} key={i} /> ) ?? []}
            </LayerGroup>
        </LayersControl.Overlay>
    </Pane>;
}