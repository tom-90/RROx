import {IPluginRenderer, Renderer, RendererMode, SettingsRegistration} from "@rrox/api";
import React from "react";
import {GamepadSettingsPage} from "./settings";
import {GamepadSetEngineButton} from "./settings/gamepadSetEngineButton";
import {LoadListener, UnloadListener} from "./listener";
import {registerCommunicator} from "../shared/communicator";
import {MapPopupElementRegistration} from "@rrox-plugins/map/renderer";

export default class AutosaveRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        if(renderer.rendererMode === RendererMode.OVERLAY) return;

        renderer.register( MapPopupElementRegistration, <GamepadSetEngineButton />)
        renderer.register( SettingsRegistration, {
            category: [ 'Gamepad' ],
            element : <GamepadSettingsPage />
        });

        LoadListener(renderer);
        registerCommunicator(renderer);
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        UnloadListener();
    }
}
