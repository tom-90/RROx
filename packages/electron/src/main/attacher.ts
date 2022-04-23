import { ValueProvider } from "@rrox/api";
import { AttachCommunicator, AttachedCommunicator, AttachStatus, DetachCommunicator } from "../shared/communicators";
import { RROxApp } from "./app";
import * as injector from 'dll-inject';
import Log from 'electron-log';

export class Attacher {
    private valueProvider: ValueProvider<AttachStatus>;
    
    constructor( private app: RROxApp ) {
        this.valueProvider = app.communicator.provideValue( AttachedCommunicator, AttachStatus.DETACHED );

        this.app.on( 'disconnect', () => this.valueProvider.provide( AttachStatus.DETACHED ) );
        this.app.on( 'ready', () => {
            this.valueProvider.provide( AttachStatus.LOADING_PLUGINS );
            this.waitForPlugins();
        } );

        this.app.communicator.handle( AttachCommunicator, () => this.attach() );
        this.app.communicator.handle( DetachCommunicator, () => this.detach() );
    }

    public attach() {
        if( this.valueProvider.getValue() !== AttachStatus.DETACHED )
            return;

        if( injector.isProcessRunning( 'arr-Win64-Shipping.exe' ) ) {
            this.valueProvider.provide( AttachStatus.INJECTING );
            
            this.app.pipeServer.start();
            const error = injector.inject( 'arr-Win64-Shipping.exe', require.resolve( '@rrox/dll/x64/Debug/RROxDLL.dll' ) );

            if( !error ) {
                this.valueProvider.provide( AttachStatus.INITIALIZING );
                Log.info( 'DLL injected.' );
            } else {
                this.valueProvider.provide( AttachStatus.DETACHED );
                Log.error( 'DLL injection failed. Error code:', error );
            }

        } else {
            Log.error( 'DLL injection failed. Game not running.' );
        }
    }

    public async detach() {
        if( this.valueProvider.getValue() !== AttachStatus.ATTACHED )
            return;

        await this.app.pipeServer.stop();

        this.app.structs.clear();
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