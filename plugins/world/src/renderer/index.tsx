import { ContextRegistration, IPluginRenderer, Renderer, SettingsRegistration } from "@rrox/api";
import React from "react";
import { WorldProvider } from "./context";
import { FeaturesSettings } from "./settings";

export default class WorldRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( ContextRegistration, <WorldProvider /> );
        
        renderer.register( SettingsRegistration, {
            category: [ 'World', 'Features' ],
            element : <FeaturesSettings />
        } );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}

export * from './context';