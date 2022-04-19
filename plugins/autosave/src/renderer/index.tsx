import { IPluginRenderer, Renderer, SettingsRegistration } from "@rrox/api";
import React from "react";
import { AutosavesSettings } from "./settings";

export default class WorldRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( SettingsRegistration, {
            category: [ 'Autosaves' ],
            element : <AutosavesSettings />
        } );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}