import {Controller, IPluginController} from "@rrox/api";

export default class GamepadPlugin extends Controller {
    public async load( controller: IPluginController ): Promise<void> {

    }

    public unload( controller: IPluginController ): void | Promise<void> {

    }
}