import { ContextRegistration, IPluginRenderer, Renderer } from "@rrox/api";
import React from "react";
import { WorldProvider } from "./context";

export default class WorldRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( ContextRegistration, <WorldProvider /> );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}

export * from './context';