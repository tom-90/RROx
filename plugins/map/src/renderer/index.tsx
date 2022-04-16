import { ContextRegistration, IPluginRenderer, MenuButtonRegistration, Renderer, RouterRegistration } from "@rrox/api";
import { DraggableModalProvider } from 'ant-design-draggable-modal';
import React from "react";
import { GlobalOutlined } from "@ant-design/icons";
import { Router } from "./router";

export default class MapRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( RouterRegistration, <Router /> );

        renderer.register( MenuButtonRegistration, 'Map', {
            linkTo: 'map',
            icon  : <GlobalOutlined />
        } );

        renderer.register( ContextRegistration, <DraggableModalProvider children={null} /> );
    }

    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}