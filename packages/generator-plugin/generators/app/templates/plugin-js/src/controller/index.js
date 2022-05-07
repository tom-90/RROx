import { Controller } from '@rrox/api';

export default class <%= toClassName( shortName ) %>Controller extends Controller {
    /**
     * Method that will be called to initialize the plugin
     *
     * @param {import('@rrox/api').IPluginController} controller Controller that gives access to several RROx API's
     */
    async load( controller ) {}
    
    /**
     * Method that will be called to unload the plugin
     *
     * @param {import('@rrox/api').IPluginController} controller Controller that gives access to several RROx API's
     */
    async unload( controller ) {}
}