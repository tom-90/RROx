import { Renderer } from "@rrox/api";
import React from "react";

export default class <%= toClassName( shortName ) %>Renderer extends Renderer {
    /**
     * Method that will be called to initialize the plugin
     *
     * @param {import('@rrox/api').IPluginRenderer} renderer Renderer that gives access to several RROx frontend API's
     */
    async load( renderer ) {}
    
    /**
     * Method that will be called to unload the plugin
     *
     * @param {import('@rrox/api').IPluginRenderer} renderer Renderer that gives access to several RROx frontend API's
     */
    async unload( renderer ) {}
}