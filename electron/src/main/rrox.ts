import { BrowserWindow } from 'electron';
import { PipeType, NamedPipe, NamedPipeServer } from './pipes';
import { Action } from './actions/action';
import { Task } from './tasks/task';
import Store from 'electron-store';
import * as config from '../shared/config';
import EventEmitter from 'events';
import { WindowType } from './windows';
import Log from 'electron-log';

export declare interface RROx {
    on( event: 'settingsUpdate', listener: () => void ): this;
}

export class RROx extends EventEmitter {

    public server   = new NamedPipeServer( 'RRO' );
    public settings = new Store<config.Schema>( config );

    private pipes  : { [ key: string ]: NamedPipe     } = {};
    private windows: { [ key: string ]: BrowserWindow } = {};

    private tasks   = new Map<{ new( app: RROx ): Task   }, Task  >();
    private actions = new Map<{ new( app: RROx ): Action }, Action>();

    constructor() {
        super();

        this.server.on( 'connect'   , ( pipe ) => this.onConnect   ( pipe ) );
        this.server.on( 'disconnect', ( pipe ) => this.onDisconnect( pipe ) );

        let logLevel = this.settings.get( 'loglevel' );
        Log.transports.file.level = logLevel;
        Log.transports.console.level = logLevel;

        this.on( 'settingsUpdate', () => {
            let logLevel = this.settings.get( 'loglevel' );
            Log.transports.file.level = logLevel;
            Log.transports.console.level = logLevel;
        } );
    }

    private onConnect( pipe: NamedPipe ) {
        if( this.pipes[ pipe.name ] )
            this.pipes[ pipe.name ]!.close();
        
        this.pipes[ pipe.name ] = pipe;
    }

    private onDisconnect( pipe: NamedPipe ) {
        this.pipes[ pipe.name ] = undefined;
    }

    public getPipe( name: PipeType ) {
        if( !this.pipes[ name ] )
            throw new Error( `Pipe '${name}' is not available` );
        return this.pipes[ name ];
    }

    public hasPipe( name: PipeType ) {
        return this.pipes[ name ] != null;
    }

    public createTask<T extends Task<any>>( task: { new( app: RROx ): T } ): T {
        if( this.tasks.has( task ) )
            throw new Error( `Task '${this.tasks.get( task ).taskName}' already exists.` );

        let t = new task( this );

        this.tasks.set( task, t );

        return t;
    }

    public createTasks( tasks: ( { new( app: RROx ): Task<any> } )[] ) {
        tasks.forEach( ( t ) => this.createTask( t ) );
    }

    public async startTasks( tasks: ( { new( app: RROx ): Task<any> } )[] ) {
        let instances = tasks.map( ( t ) =>  this.getTask( t ) );

        await Promise.all( instances.map( ( t ) => t.start() ).filter( ( r ) => r instanceof Promise ) );
    }

    public getTask<T extends Task<any>>( task: { new( app: RROx ): T } ): T {
        if( !this.tasks.has( task ) )
            throw new Error( `Task '${task.name}' does not exist.` );
        return this.tasks.get( task ) as T;
    }

    public createAction<A extends Action<any,any>>( action: { new( app: RROx ): A } ): A {
        if( this.actions.has( action ) )
            throw new Error( `Action '${this.actions.get( action ).actionName}' already exists.` );

        let a = new action( this );

        this.actions.set( action, a );

        return a;
    }

    public createActions( actions: ( { new( app: RROx ): Action<any,any> } )[] ) {
        actions.forEach( ( a ) => this.createAction( a ) );
    }

    public getAction<A extends Action<any,any>>( action: { new( app: RROx ): A } ): A {
        if( !this.actions.has( action ) )
            throw new Error( `Action '${action.name}' does not exist.` );
        return this.actions.get( action ) as A;
    }

    public addWindow( type: WindowType, window: BrowserWindow ) {
        if( this.windows[ type ] )
            throw new Error( `Window '${type}' already exists.` );
        
        this.windows[ type ] = window;
        window.on( 'close', () => delete this.windows[ type ] );
    }

    public getWindow( type: WindowType ) {
        if( !this.windows[ type ] )
            throw new Error( `Window '${type}' is not available` );
        return this.windows[ type ];
    }

    /**
     * Broadcast message to all browser windows
     *
     * @param channel 
     * @param args 
     */
    public broadcast( channel: string, ...args: any[] ) {
        Object.values( this.windows ).forEach( ( w ) => w.webContents.send( channel, ...args ) );
    }

}