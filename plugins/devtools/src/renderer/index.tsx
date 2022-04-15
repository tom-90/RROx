import React from "react";
import { ProfileOutlined } from "@ant-design/icons";
import { IPluginRenderer, MenuButtonRegistration, Renderer, RouterRegistration } from "@rrox/api";
import { Router } from "./router";

export default class DevtoolsRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( RouterRegistration, <Router /> );

        renderer.register( MenuButtonRegistration, 'Structs', {
            linkTo: 'structs',
            icon  : <ProfileOutlined />
        } );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        console.log( 'devtools unload' );
    }
}