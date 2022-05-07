import { IPluginRenderer, Renderer } from "@rrox/api";

export default class <%= toClassName( shortName ) %>Renderer extends Renderer {
    /**
     * Method that will be called to initialize the plugin
     *
     * @param renderer Renderer that gives access to several RROx frontend API's
     */
    public load( renderer: IPluginRenderer ) {}
    
    /**
     * Method that will be called to unload the plugin
     *
     * @param renderer Renderer that gives access to several RROx frontend API's
     */
    public unload( renderer: IPluginRenderer ) {}
}