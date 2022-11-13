import React from "react";
import { ProfileOutlined, CodeOutlined } from "@ant-design/icons";
import { IPluginRenderer, MenuButtonRegistration, Renderer, RouterRegistration } from "@rrox/api";
import { Router } from "./router";

export default class DevtoolsRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( RouterRegistration, <Router /> );

        renderer.register( MenuButtonRegistration, 'Structs', {
            linkTo: 'structs',
            icon  : <ProfileOutlined />
        } );

        renderer.register( MenuButtonRegistration, 'Console', {
            linkTo: 'repl',
            icon  : <CodeOutlined />
        } );

        if ( module.hot ) {
            module.hot.accept();
            module.hot.dispose(() => {
                renderer.reload();
            });
        }
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        console.log( 'devtools unload' );
    }
}