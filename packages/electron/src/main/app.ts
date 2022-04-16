import { Action } from "./actions";
import { NamedPipe, NamedPipeServer } from "./net";
import { StructStore } from "./struct";
import { IPCCommunicator, PluginManager, SettingsManager } from "./plugins";
import { EventEmitter } from "events";
import { BrowserWindow } from "electron";
import { ControllerCommunicator } from "@rrox/api";
import { AttachedCommunicator } from "../shared/communicators";

interface RROxAppEvents {
    on( event: 'connect'   , listener: ( pipe: NamedPipe ) => void ): this;
    on( event: 'ready'     , listener: () => void                  ): this;
    on( event: 'disconnect', listener: ( pipe: NamedPipe ) => void ): this;
}

export class RROxApp extends EventEmitter implements RROxAppEvents {
    public communicator: ControllerCommunicator = new IPCCommunicator( this );
    public settings = new SettingsManager( this.communicator )

    public structs    = new StructStore();
    public pipeServer = new NamedPipeServer( this, 'RRO' );
    public plugins    = new PluginManager( this );

    public windows: BrowserWindow[] = [];


    private pipe?: NamedPipe;
    private actions = new Map<{ new( app: RROxApp ): Action }, Action>();

    constructor() {
        super();

        this.on( 'connect', ( pipe ) => this.pipe = pipe );
        this.on( 'disconnect', () => this.pipe = undefined );

        this.communicator.handle( AttachedCommunicator, () => {
            return this.isConnected();
        } );
    }

    public getPipe() {
        return this.pipe;
    }

    public isConnected() {
        return this.pipe != null;
    }

    public getAction<A extends Action>( action: { new( app: RROxApp ): A } ): A {
        if( this.actions.has( action ) )
            return this.actions.get( action )! as A;

        const instance = new action( this );
        this.actions.set( action, instance );

        return instance;
    }

    public addWindow( window: BrowserWindow ) {
        this.windows.push( window );
        window.on( 'close', () => this.windows = this.windows.filter( ( w ) => w !== window ) );
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

    /**
     * Broadcast message to all browser windows and websocket
     *
     * @param channel 
     * @param args 
     */
    public publicBroadcast( channel: string, ...args: any[] ) {
        this.broadcast( channel, ...args );

        // TODO: Socket implementation
        //if( this.socket.mode === SocketMode.HOST )
        //    this.socket.broadcast( channel, ...args );
    }
}