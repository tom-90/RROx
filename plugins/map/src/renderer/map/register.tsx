import { IPluginRenderer } from "@rrox/api";
import React from 'react';
import { Pane } from "react-leaflet";
import { TeleportPopupButton } from "./elements/popupElements";
import { BackgroundPane, FramesPane, GroundworkPane, IndustriesPane, PlayersPane, SandhousesPane, SwitchesPane, TrackPane, TurntablesPane, WatertowersPane } from "./panes";
import { MapPopupElementRegistration } from "./registrations";
import { MapLayerRegistration } from "./registrations/layer";

export function registerDefaultMapElements( renderer: IPluginRenderer ): void {
    renderer.register( MapLayerRegistration, <BackgroundPane /> );
    renderer.register( MapLayerRegistration, <FramesPane /> );
    renderer.register( MapLayerRegistration, <GroundworkPane /> );
    renderer.register( MapLayerRegistration, <IndustriesPane /> );
    renderer.register( MapLayerRegistration, <PlayersPane /> );
    renderer.register( MapLayerRegistration, <SandhousesPane /> );
    renderer.register( MapLayerRegistration, <SwitchesPane /> );
    renderer.register( MapLayerRegistration, <TrackPane /> );
    renderer.register( MapLayerRegistration, <TurntablesPane /> );
    renderer.register( MapLayerRegistration, <WatertowersPane /> );
    renderer.register( MapLayerRegistration, <Pane name='popups' style={{ zIndex: 100 }} /> );

    renderer.register( MapPopupElementRegistration, <TeleportPopupButton /> );
}