import { shell } from 'electron';
import path from 'path';
import { IPluginController, Controller } from '@rrox/api';
import { OpenSaveFolderCommunicator } from '../shared/communicators/saveFolder';
import { Autosaver } from './autosaver';

export default class AutosavePlugin extends Controller {
    public async load( controller: IPluginController ): Promise<void> {
        const saver = new Autosaver( controller );

        controller.addSetup( () => {
            saver.start();

            return () => saver.stop();
        } );

        controller.communicator.handle( OpenSaveFolderCommunicator, async () => {
            if( process.env.LOCALAPPDATA )
                await shell.openPath( path.resolve( process.env.LOCALAPPDATA, 'arr/Saved/SaveGames' ) );
        } );
    }
    
    public unload( controller: IPluginController ): void | Promise<void> {
        
    }
}