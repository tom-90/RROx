import { IPluginRenderer, Renderer, SettingsRegistration, ShareMode } from "@rrox/api";
import React from "react";
import { AutosavesSettings } from "./settings";

export default class AutosaveRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        if( renderer.shareMode !== ShareMode.CLIENT )
            renderer.register( SettingsRegistration, {
                category: [ 'Autosaves' ],
                element : <AutosavesSettings />
            } );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}