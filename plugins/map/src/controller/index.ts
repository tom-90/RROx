import { IPluginController, Controller } from '@rrox/api';
import { MapSettings } from '../shared';

export default class MapPlugin extends Controller {
    public async load( controller: IPluginController ): Promise<void> {
        controller.settings.init( MapSettings );
    }
    
    public unload( controller: IPluginController ): void | Promise<void> {}
}