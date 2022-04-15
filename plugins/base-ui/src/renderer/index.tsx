import { IPluginRenderer, Renderer } from "@rrox/api";
import "./app.less";

export default class BaseUIRenderer extends Renderer {
    public load( renderer: IPluginRenderer ): void | Promise<void> {
        //renderer.register( RouterRegistration, <Router /> );
    }
    public unload( renderer: IPluginRenderer ): void | Promise<void> {
        console.log( 'baseui unload' );
    }
}

export * from "./components";