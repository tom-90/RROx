import { ValueProvider } from "@rrox/api";
import path from 'path';
import fs from 'fs';
import { shell } from 'electron';
import { AttachCommunicator, AttachedCommunicator, AttachStatus, DetachCommunicator, OpenDLLFolderCommunicator } from "../shared/communicators";
import { RROxApp } from "./app";
import * as injector from 'dll-inject';
import Log from 'electron-log';
import DLL from '@rrox/dll/x64/Release/RROxDLL.dll';

export class Attacher {
    private valueProvider: ValueProvider<AttachStatus>;
    
    constructor( private app: RROxApp ) {
        this.valueProvider = app.communicator.provideValue( AttachedCommunicator, AttachStatus.DETACHED );

        this.app.on( 'disconnect', () => this.valueProvider.provide( AttachStatus.DETACHED ) );
        this.app.on( 'ready', () => {
            this.valueProvider.provide( AttachStatus.LOADING_PLUGINS );
            this.waitForPlugins();
        } );

        this.app.communicator.handle( AttachCommunicator, ( manual ) => this.attach( manual ) );
        this.app.communicator.handle( DetachCommunicator, () => this.detach() );

        this.app.communicator.handle( OpenDLLFolderCommunicator, async () => {
            await shell.openPath( path.dirname( path.resolve( __dirname, DLL ) ) );
        } );
    }

    public async attach( manual: boolean = false ): Promise<string | void> {
        if( this.valueProvider.getValue() !== AttachStatus.DETACHED )
            return;

        if( manual ) {
            this.app.pipeServer.start();
            this.valueProvider.provide( AttachStatus.INITIALIZING );
            return;
        }

        const dllPath = path.resolve( __dirname, DLL );

        try {
            await fs.promises.access( dllPath, fs.constants.F_OK )
        } catch( e ) {
            return `Could not access the DLL file. It might have been removed or blocked by your antivirus.`;
        }

        if( injector.isProcessRunning( 'arr-Win64-Shipping.exe' ) ) {
            this.valueProvider.provide( AttachStatus.INJECTING );
            
            this.app.pipeServer.start();
            const error = injector.inject( 'arr-Win64-Shipping.exe', dllPath );

            if( !error ) {
                this.valueProvider.provide( AttachStatus.INITIALIZING );
                Log.info( 'DLL injected.' );
            } else {
                this.valueProvider.provide( AttachStatus.DETACHED );
                Log.error( 'DLL injection failed. Error code:', error );
                return `DLL injection failed with error code: ${error}`;
            }

        } else {
            Log.error( 'DLL injection failed. Game not running.' );
            return 'Failed to inject the DLL. The game is not running.';
        }
    }

    public async detach() {
        if( this.valueProvider.getValue() === AttachStatus.DETACHED )
            return;

        await this.app.pipeServer.stop();

        this.app.structs.clear();

        this.valueProvider.provide( AttachStatus.DETACHED );
    }

    private async waitForPlugins() {
        let promises: Promise<void>[] = [];

        for( let plugin of Object.values( this.app.plugins.getLoadedPlugins() ) ) {
            if( plugin.isInitialized() )
                continue;

            promises.push( new Promise( ( resolve ) => plugin.once( 'initialized', resolve ) ) );
        }

        await Promise.all( promises );

        this.valueProvider.provide( AttachStatus.ATTACHED );
    }
}