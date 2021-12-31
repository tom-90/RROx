import { app as electron } from 'electron';
import { promises as fs, constants as fsconstants } from 'fs';
import { ChildProcess, spawn, exec } from "child_process";
import { Task } from "./task";
import { AttachedState } from '@rrox/types';
import { InjectDLLAction } from "../actions";
import { NamedPipe, PipeType } from "../pipes";
import { RROx } from "../rrox";
import { WindowType } from '../windows';
import Injector from '@rrox/assets/binaries/RROxInjector.exe';
import Elevator from '@rrox/assets/binaries/elevate-x64.exe';
import DLL from '@rrox/assets/binaries/RailroadsOnlineExtended.dll';
import Log from 'electron-log';
import path from 'path';

export class AttachTask extends Task {

    public taskName = "Attach to Game";

    public state = AttachedState.DETACHED;

    private process: ChildProcess;

    private shuttingDown = false;

    constructor( app: RROx ) {
        super( app );
        electron.on( 'will-quit', ( event ) => {
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

        const elevatorExists = await this.fileExists( path.resolve( __dirname, Elevator ) );

        if ( !elevatorExists ) {
            Log.error( 'Elevator missing.' );
            this.setState( AttachedState.DETACHED, undefined, 'MISSING_ELEVATE_EXE' );
            return;
        }

        const injectorExists = await this.fileExists( path.resolve( __dirname, Injector ) );

        if ( !injectorExists ) {
            Log.error( 'Injector missing.' );
            this.setState( AttachedState.DETACHED, undefined, 'MISSING_INJECTOR_EXE' );
            return;
        }

        const dllExists = await this.fileExists( path.resolve( __dirname, DLL ) );

        if ( !dllExists ) {
            Log.error( 'Injector missing.' );
            this.setState( AttachedState.DETACHED, undefined, 'MISSING_DLL' );
            return;
        }

        const msvcrExists = await this.fileExists( path.resolve( 'C:/Windows/SysWOW64/MSVCR120.dll' ) );

        if ( !msvcrExists ) {
            Log.error( 'MSVCR120.dll missing.' );
            this.setState( AttachedState.DETACHED, undefined, 'MSVCR120_MISSING' );
            return;
        }

        this.app.server.start();

        try {
            this.process = this.execElevated( path.resolve( __dirname, Injector ) );
        } catch( e ) {
            Log.error( e );
            this.setState( AttachedState.DETACHED, undefined, 'INJECTOR_CRASHED' );
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

        Log.info( 'Stopping server' );

        await this.app.server.stop();

        Log.info( 'Stopped server' );

        await new Promise<void>( ( resolve ) => {
            const onClose = () => {
                clearTimeout( timeout );
                this.process?.removeListener( 'close', onClose );
                resolve();
            };
            this.process.once( 'close', onClose );
            let timeout = setTimeout( onClose, 10000 );
        } ); // Wait 5 seconds to allow process to exit
        
        // @ts-expect-error
        if( this.state !== AttachedState.DETACHED ) {
            Log.info( 'Forcefully killing injector' );
            await this.kill();
        }

        Log.info( 'Detached.' );
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

    private setState( state: AttachedState, progress?: number, error?: string ) {
        this.state = state;
        if( this.shuttingDown )
            return;
        this.app.broadcast( 'get-attached-state', this.state, progress, error );
    }

    private execElevated( command: string | string[] ) {
        let process = spawn(
            path.resolve( __dirname, Elevator ),
            Array.isArray( command ) ? [ '-w', ...command ] : [ '-w', command ]
        );

        process.stdout.on( 'data', ( data ) => {
            Log.info( data.toString() );
        } );

        process.stderr.on( 'data', ( data ) => {
            Log.info( data.toString() );
        } );

        return process;
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

    private fileExists( path: string ) {
        return fs.access( path, fsconstants.F_OK )
            .then( () => true )
            .catch( () => false )
    }

}