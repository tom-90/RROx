import { IPluginController, Controller, Actions } from '@rrox/api';
import { World } from './world';

export default class WorldPlugin extends Controller {
    private world: World;

    public async load( controller: IPluginController ): Promise<void> {
        this.world = new World( controller );

        controller.addSetup( async () => {
            await this.world.prepare();

            const interval = setInterval( () => this.world.load(), 1000 );

            return () => {
                clearInterval( interval );
            }
        } );
    }
    
    public unload( controller: IPluginController ): void | Promise<void> {
        throw new Error( 'Method not implemented.' );
    }
}