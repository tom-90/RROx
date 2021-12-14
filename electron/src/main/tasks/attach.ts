import { app as electron } from 'electron';
import { ChildProcess, spawn, exec } from "child_process";
import { Task } from "./task";
import { AttachedState } from '../../shared/state';
import { InjectDLLAction, StopAction } from "../actions";
import { NamedPipe, PipeType } from "../pipes";
import { RROx } from "../rrox";
import { WindowType } from '../windows';
import Injector from '../../../assets/binaries/RROxInjector.exe';
import Elevator from '../../../assets/binaries/elevate-x64.exe';
import Log from 'electron-log';
import path from 'path';

export class AttachTask extends Task {

    public taskName = "Attach to Game";

    public state = AttachedState.DETACHED;

    private process: ChildProcess;

    private shuttingDown = false;

    constructor( app: RROx ) {
        super( app );
        electron.on( 'before-quit', ( event ) => {
            event.preventDefault();
            this.shuttingDown = true;
            this.stop().then( () => {
                electron.exit();
            } ).catch( ( e ) => {
                Log.error( 'Error while cleaning up:', e );
                electron.exit();
            })
        } );

        const appWindow = app.getWindow( WindowType.App );

        appWindow.on( 'ready-to-show', () => {
            this.hasDanglingInjector().then( ( result ) => {
                if( !result )
                    return;
                Log.info( 'Dangling Injector Detected.' );
                appWindow.webContents.send( 'dangling-injector', 'DETECTED' );
            } ).catch( ( e ) => {
                Log.error( 'Error while checking for dangling injector:', e );
            } );
        } );
    }

    protected execute(): void {}

    public async start() {
        if( this.state !== AttachedState.DETACHED || this.process != null )
            throw new Error( 'Cannot attach. Invalid state.' );

        this.setState( AttachedState.ATTACHING );

        try {
            this.process = this.execElevated( path.resolve( __dirname, Injector ) );
        } catch( e ) {
            Log.error( e );
            this.setState( AttachedState.DETACHED );
            return;
        }

        this.process.on( 'error', ( err ) => {
            Log.error( 'Injector encountered error:', err );
        } );

        this.process.on( 'close', () => {
            Log.info( 'Injector closed.' );
            this.setState( AttachedState.DETACHED );
            this.process = undefined;
        } );

        await new Promise<void>( ( resolve, reject ) => {
            let logger: NamedPipe;

            const onConnect = ( pipe: NamedPipe ) => {
                if( pipe.name === PipeType.CheatEngineLog ) 
                    pipe.socket.on( 'data', onLog );
                else if( pipe.name === PipeType.CheatEngineData ) {
                    removeListeners();
                    resolve();
                }
            };

            const onClose = () => {
                removeListeners();
                reject( new Error( 'Injector closed unexpectedly') );
            };

            const onLog = ( data: Buffer ) => {
                if( this.state !== AttachedState.ATTACHING )
                    return;
                let match = /\(PROGRESS (\d+\.?\d*)%\)/g.exec( data.toString() );
                if( !match )
                    return;
                let progress = Number( match[ 1 ] );
                if( isNaN( progress ) )
                    return;
                this.setState( AttachedState.ATTACHING, progress );
            };

            const removeListeners = () => {
                this.app.server.removeListener( 'connect', onConnect );

                if( this.process )
                    this.process.removeListener( 'close', onClose );

                if( logger )
                    logger.socket.removeListener( 'data', onLog );
            };
            
            this.app.server.on( 'connect', onConnect );
            this.process.once( 'close', onClose );
            
            this.setState( AttachedState.ATTACHING, 10 );
        } );

        await this.app.getAction( InjectDLLAction ).run();

        this.setState( AttachedState.ATTACHED );
    }

    public async stop() {
        if( this.state === AttachedState.DETACHED )
            return;
        if( !this.process ) {
            this.setState( AttachedState.DETACHED );
            return;
        }

        this.setState( AttachedState.DETACHING );

        if( await this.app.getAction( StopAction ).run() !== false )
            await new Promise( ( resolve ) => setTimeout( resolve, 5000 ) ); // Wait 5 seconds to allow process to exit
        
        // @ts-expect-error
        if( this.state !== AttachedState.DETACHED )
            await this.kill();
    }

    public async kill() {
        let process = this.execElevated( [ 'taskkill', '/im', 'RROxInjector.exe', '/t', '/f' ] );

        await new Promise<void>( ( resolve, reject ) => {
            process.once( 'exit', ( status ) => {
                if( status === 0 )
                    resolve();
                else {
                    if( this.state === AttachedState.DETACHING )
                        this.setState( AttachedState.ATTACHED );
                    reject( new Error( 'Failed to detach process' ) );
                }
            } );
        } );
    }

    private setState( state: AttachedState, progress?: number ) {
        this.state = state;
        if( this.shuttingDown )
            return;
        this.app.broadcast( 'get-attached-state', this.state, progress );
    }

    private execElevated( command: string | string[] ) {
        return spawn( path.resolve( __dirname, Elevator ), Array.isArray( command ) ? [ '-w', ...command ] : [ '-w', command ] );
    }

    private hasDanglingInjector() {
        return new Promise<boolean>( ( resolve, reject ) => {
            exec( 'tasklist /fi "ImageName eq RROxInjector.exe"', ( err, stdout ) => {
                if( err )
                    reject( err );
                else
                    resolve( stdout.toLowerCase().includes( 'rroxinjector.exe' ) );
            } );
        } );
    }

}