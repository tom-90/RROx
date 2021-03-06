import { ContextRegistration, IPluginRenderer, Renderer, SettingsRegistration, ShareMode } from "@rrox/api";
import React from "react";
import { WorldProvider } from "./context";
import { FeaturesSettings, IntervalSettings } from "./settings";

export default class WorldRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( ContextRegistration, <WorldProvider /> );
        
        if( renderer.shareMode !== ShareMode.CLIENT ) {
            renderer.register( SettingsRegistration, {
                category: [ 'World', 'Intervals' ],
                element : <IntervalSettings />
            } );

            renderer.register( SettingsRegistration, {
                category: [ 'World', 'Features' ],
                element : <FeaturesSettings />
            } );
        }
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {

    }
}

export * from './context';