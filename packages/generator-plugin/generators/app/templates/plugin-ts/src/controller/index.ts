import { Controller, IPluginController } from '@rrox/api';

export default class <%= toClassName( shortName ) %>Plugin extends Controller {
    /**
     * Method that will be called to initialize the plugin
     *
     * @param controller Controller that gives access to several RROx API's
     */
    public async load( controller: IPluginController ) {}
    
    /**
     * Method that will be called to unload the plugin
     *
     * @param controller Controller that gives access to several RROx API's
     */
    public async unload( controller: IPluginController ) {}
}