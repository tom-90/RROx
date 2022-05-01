import { IPluginRenderer, Renderer, SettingsRegistration, ShareMode } from "@rrox/api";
import React from "react";
import { GamepadSettingsPage } from "./settings";
import {LoadListener, UnloadListener} from "./listener";
import {FrameCarControl, SetControlsCommunicator} from "@rrox-plugins/world/shared";

export default class AutosaveRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        renderer.register( SettingsRegistration, {
            category: [ 'Gamepad' ],
            element : <GamepadSettingsPage />
        });

        console.log("communicator available: "+renderer.communicator.isAvailable());
        console.log("can use controls: "+renderer.communicator.canUse(SetControlsCommunicator));
        renderer.communicator.rpc(SetControlsCommunicator, 0, FrameCarControl.Regulator, 0.5)

        LoadListener(renderer);
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        UnloadListener();
    }
}