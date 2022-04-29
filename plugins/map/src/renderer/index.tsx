import { ContextRegistration, IPluginRenderer, MenuButtonRegistration, OverlayRegistration, Renderer, RendererMode, RouterRegistration, SettingsRegistration } from "@rrox/api";
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import React from "react";
import { GlobalOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Router } from "./router";
import { ColorSettings, MapSettings, MinimapSettings } from "./settings";
import { MapOverlay } from "./map";

export default class MapRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( RouterRegistration, <Router /> );

        renderer.register( MenuButtonRegistration, 'Map', {
            linkTo: 'map',
            icon  : <GlobalOutlined />
        } );
        
        renderer.register( MenuButtonRegistration, 'Rolling Stock', {
            linkTo: 'controls',
            icon  : <UnorderedListOutlined />
        } );

        renderer.register( SettingsRegistration, {
            category: [ 'Map', 'Background' ],
            element : <MapSettings />
        } );

        renderer.register( SettingsRegistration, {
            category: [ 'Map', 'Colors' ],
            element : <ColorSettings />
        } );

        if( renderer.rendererMode !== RendererMode.WEB )
            renderer.register( SettingsRegistration, {
                category: [ 'Map', 'Minimap' ],
                element : <MinimapSettings />
            } );

        renderer.register( ContextRegistration, <DraggableModalProvider children={null} /> );

        renderer.register( OverlayRegistration, <MapOverlay/> );
    }

    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}