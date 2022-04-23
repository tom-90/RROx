import { IPluginController, Controller } from '@rrox/api';

export default class MapPlugin extends Controller {
    public async load( controller: IPluginController ): Promise<void> {}
    public unload( controller: IPluginController ): void | Promise<void> {}
}